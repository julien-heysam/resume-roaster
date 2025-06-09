from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
import base64
import io
from pdf2image import convert_from_bytes
from PIL import Image
import os
import subprocess
import tempfile
import shutil
from typing import List
import logging
import uuid
from pathlib import Path
import tarfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
def validate_and_fix_latex_content(latex_code: str) -> tuple[str, List[str]]:
    """
    Validate LaTeX content, suggest missing packages, and auto-fix common issues
    """
    warnings = []
    fixed_latex = latex_code
    
    # Common commands that require specific packages
    package_requirements = {
        r'\usepackage{fontawesome}': [r'\fa'],
        r'\usepackage{geometry}': [r'\geometry', r'\newgeometry'],
        r'\usepackage{hyperref}': [r'\href', r'\url', r'\hypersetup'],
        r'\usepackage{graphicx}': [r'\includegraphics'],
        r'\usepackage{amsmath}': [r'\align', r'\equation', r'\matrix'],
        r'\usepackage{enumitem}': [r'\setlist'],
        r'\usepackage{titlesec}': [r'\titleformat'],
        r'\usepackage{xcolor}': [r'\textcolor', r'\color'],
        r'\usepackage{tikz}': [r'\tikz', r'\begin{tikzpicture}'],
    }
    
    # Auto-fix missing packages
    packages_to_add = []
    
    for package, commands in package_requirements.items():
        package_included = package in fixed_latex
        commands_used = any(cmd in fixed_latex for cmd in commands)
        
        if commands_used and not package_included:
            warnings.append(f"Auto-fixing: Adding {package} - detected usage of {[cmd for cmd in commands if cmd in fixed_latex]}")
            packages_to_add.append(package)
    
    # Add missing packages after \documentclass
    if packages_to_add:
        # Find the position after \documentclass line
        import re
        documentclass_match = re.search(r'\\documentclass.*?\n', fixed_latex)
        if documentclass_match:
            insert_pos = documentclass_match.end()
            packages_text = '\n'.join(packages_to_add) + '\n'
            fixed_latex = fixed_latex[:insert_pos] + packages_text + fixed_latex[insert_pos:]
            warnings.append(f"Added {len(packages_to_add)} missing packages automatically")
    
    # Replace problematic FontAwesome commands with text alternatives for Tectonic
    fa_replacements = {
        r'\faEnvelope': r'\textbf{@}',
        r'\faPhone': r'\textbf{Tel:}',
        r'\faLinkedin': r'\textbf{LinkedIn:}',
        r'\faGithub': r'\textbf{GitHub:}',
        r'\faGlobe': r'\textbf{Web:}',
        r'\faMapMarker': r'\textbf{Location:}',
        r'\faCalendar': r'\textbf{Date:}',
        r'\faBriefcase': r'\textbf{Work:}',
        r'\faGraduationCap': r'\textbf{Education:}',
    }
    
    fa_commands_found = []
    for fa_cmd, replacement in fa_replacements.items():
        if fa_cmd in fixed_latex:
            fixed_latex = fixed_latex.replace(fa_cmd, replacement)
            fa_commands_found.append(fa_cmd)
    
    if fa_commands_found:
        warnings.append(f"Replaced FontAwesome icons with text: {fa_commands_found}")
    
    return fixed_latex, warnings

class LaTeXRequest(BaseModel):
    latex_code: str
    filename: str = "document.pdf"

app = FastAPI(
    title="PDF Converter Service",
    description="Convert PDF files to JPEG images and compile LaTeX code to PDF",
    version="1.1.0"
)

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "PDF Converter Service", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Health check for monitoring"""
    return {"status": "healthy", "service": "pdf-converter"}

@app.post("/test-autofix")
async def test_autofix(request: LaTeXRequest):
    """Test endpoint to verify auto-fix function is working"""
    try:
        fixed_latex, warnings = validate_and_fix_latex_content(request.latex_code)
        return {
            "original_length": len(request.latex_code),
            "fixed_length": len(fixed_latex),
            "original_preview": request.latex_code[:100],
            "fixed_preview": fixed_latex[:100],
            "warnings": warnings
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/latex-to-pdf")
async def compile_latex_to_pdf(request: LaTeXRequest):
    """
    Compile LaTeX code to PDF using improved approach
    
    Args:
        request: LaTeXRequest containing latex_code and optional filename
        
    Returns:
        PDF file as binary response
    """
    try:
        logger.info(f"Compiling LaTeX code to PDF: {request.filename}")
        
        # Validate and auto-fix LaTeX content
        fixed_latex_code, validation_warnings = validate_and_fix_latex_content(request.latex_code)
        if validation_warnings:
            logger.info(f"LaTeX auto-fixes applied: {validation_warnings}")
        
        # Create unique temp directory to avoid conflicts
        temp_dir = Path(tempfile.gettempdir()) / str(uuid.uuid4())
        temp_dir.mkdir(exist_ok=True)
        
        try:
            # Write fixed LaTeX code to a .tex file
            tex_file = temp_dir / "document.tex"
            tex_file.write_text(fixed_latex_code, encoding='utf-8')
            
            # Set up environment for LaTeX compilation
            env = os.environ.copy()
            
            # Check if we're on Heroku (has apt-installed LaTeX)
            if os.path.exists('/app/.apt/usr/bin/pdflatex'):
                # Heroku with apt buildpack LaTeX - improved configuration
                env['PATH'] = '/app/.apt/usr/bin:/app/.apt/usr/share/texlive/texmf-dist/scripts/texlive:' + env.get('PATH', '')
                env['TEXMFCACHE'] = str(temp_dir)
                env['TEXMFVAR'] = str(temp_dir)
                env['TEXMFHOME'] = str(temp_dir)
                env['TEXMFLOCAL'] = str(temp_dir)
                # Set TEXMF paths for Heroku
                env['TEXMFROOT'] = '/app/.apt/usr/share/texlive/texmf-dist'
                env['TEXMF'] = '/app/.apt/usr/share/texlive/texmf-dist'
                env['TEXMFCNF'] = '/app/.apt/usr/share/texlive/texmf-dist/web2c'
                env['TEXMFMAIN'] = '/app/.apt/usr/share/texlive/texmf-dist'
                # Add library and Perl paths
                env['LD_LIBRARY_PATH'] = '/app/.apt/usr/lib/x86_64-linux-gnu:' + env.get('LD_LIBRARY_PATH', '')
                env['PERL5LIB'] = '/app/.apt/usr/share/texlive/texmf-dist/scripts/texlive:' + env.get('PERL5LIB', '')
                latex_cmd = '/app/.apt/usr/bin/pdflatex'
                
                # Try to initialize format files if they don't exist
                try:
                    fmt_result = subprocess.run([
                        '/app/.apt/usr/bin/fmtutil-sys', '--all'
                    ], capture_output=True, text=True, timeout=60, env=env)
                    if fmt_result.returncode == 0:
                        logger.info("Successfully initialized LaTeX format files")
                    else:
                        logger.warning(f"Format initialization warning: {fmt_result.stderr}")
                except Exception as e:
                    logger.warning(f"Could not initialize format files: {e}")
            else:
                # Local development or other deployment
                latex_cmd = 'pdflatex'
            
            # Compile LaTeX to PDF
            logger.info(f"Running LaTeX compilation with {latex_cmd}")
            
            # Run pdflatex twice to resolve references
            for run_num in range(2):
                result = subprocess.run([
                    latex_cmd,
                    '-interaction=nonstopmode',
                    '-output-directory', str(temp_dir),
                    str(tex_file)
                ], capture_output=True, text=True, timeout=30, env=env)
                
                if result.returncode != 0:
                    logger.error(f"LaTeX compilation failed (run {run_num + 1}): {result.stderr}")
                    if run_num == 0:
                        # Try once more on first failure
                        continue
                    else:
                        # Extract meaningful error from LaTeX output
                        error_lines = result.stderr.split('\n')
                        meaningful_errors = [line for line in error_lines if 
                                           'Error:' in line or 'error:' in line or 
                                           'Undefined control sequence' in line or
                                           'Missing' in line]
                        error_msg = '\n'.join(meaningful_errors[:3]) if meaningful_errors else result.stderr[:500]
                        
                        raise HTTPException(
                            status_code=400,
                            detail=f"LaTeX compilation failed: {error_msg}"
                        )
                
                logger.info(f"LaTeX compilation run {run_num + 1} successful")
            
            # Check if PDF was generated
            pdf_file = temp_dir / "document.pdf"
            if not pdf_file.exists():
                raise HTTPException(
                    status_code=500,
                    detail="PDF file was not generated successfully"
                )
            
            # Read the generated PDF
            pdf_content = pdf_file.read_bytes()
            logger.info(f"Generated PDF size: {len(pdf_content)} bytes")
            
            # Return PDF as binary response
            return Response(
                content=pdf_content,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename={request.filename}"
                }
            )
            
        finally:
            # Cleanup temp directory
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                logger.warning(f"Failed to cleanup temp directory: {e}")
                
    except subprocess.TimeoutExpired:
        logger.error("LaTeX compilation timed out")
        raise HTTPException(
            status_code=408,
            detail="LaTeX compilation timed out (30 seconds limit)"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in LaTeX compilation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/latex-to-pdf-tectonic")
async def compile_latex_with_tectonic(request: LaTeXRequest):
    """
    Alternative LaTeX compilation using Tectonic (lighter weight)
    
    Args:
        request: LaTeXRequest containing latex_code and optional filename
        
    Returns:
        PDF file as binary response
    """
    import aiohttp
    import asyncio
    
    try:
        logger.info(f"Compiling LaTeX with Tectonic: {request.filename}")
        
        # Validate and auto-fix LaTeX content
        logger.info(f"TECTONIC: Original LaTeX code length: {len(request.latex_code)}")
        logger.info(f"TECTONIC: Original LaTeX preview: {request.latex_code[:100]}...")
        
        try:
            fixed_latex_code, validation_warnings = validate_and_fix_latex_content(request.latex_code)
            logger.info(f"TECTONIC: Fixed LaTeX code length: {len(fixed_latex_code)}")
            logger.info(f"TECTONIC: Fixed LaTeX preview: {fixed_latex_code[:100]}...")
            if validation_warnings:
                logger.info(f"TECTONIC: LaTeX auto-fixes applied: {validation_warnings}")
            else:
                logger.info("TECTONIC: No auto-fixes needed")
        except Exception as e:
            logger.error(f"TECTONIC: Error in validate_and_fix_latex_content: {e}")
            fixed_latex_code = request.latex_code
            validation_warnings = []
        
        # Create unique temp directory
        temp_dir = Path(tempfile.gettempdir()) / str(uuid.uuid4())
        temp_dir.mkdir(exist_ok=True)
        
        try:
            # Write fixed LaTeX code to file
            tex_file = temp_dir / "document.tex"
            tex_file.write_text(fixed_latex_code, encoding='utf-8')
            
            # Check if tectonic is available
            tectonic_path = "/tmp/tectonic"
            
            # Download tectonic if not available
            if not os.path.exists(tectonic_path):
                logger.info("Downloading Tectonic...")
                try:
                    async with aiohttp.ClientSession() as session:
                        url = "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.14.1/tectonic-0.14.1-x86_64-unknown-linux-musl.tar.gz"
                        async with session.get(url) as resp:
                            if resp.status == 200:
                                import tarfile
                                content = await resp.read()
                                
                                # Extract tectonic binary
                                with tempfile.NamedTemporaryFile() as tmp_file:
                                    tmp_file.write(content)
                                    tmp_file.flush()
                                    
                                    with tarfile.open(tmp_file.name, 'r:gz') as tar:
                                        tar.extract('tectonic', '/tmp/')
                                        os.chmod(tectonic_path, 0o755)
                            else:
                                raise Exception(f"Failed to download Tectonic: {resp.status}")
                except Exception as e:
                    logger.error(f"Failed to download Tectonic: {e}")
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to setup Tectonic engine. Try the regular /latex-to-pdf endpoint."
                    )
            
            # Compile with Tectonic
            result = subprocess.run([
                tectonic_path,
                '--outdir', str(temp_dir),
                str(tex_file)
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                logger.error(f"Tectonic compilation failed: {result.stderr}")
                logger.error(f"Tectonic stdout: {result.stdout}")
                
                # Also log the LaTeX content for debugging
                logger.error(f"Original LaTeX content:\n{request.latex_code}")
                logger.error(f"Fixed LaTeX content that failed:\n{fixed_latex_code}")
                
                # Extract more meaningful error information
                error_output = result.stderr + "\n" + result.stdout
                
                # Add validation warnings to error message if any
                error_detail = f"Tectonic compilation failed: {error_output[:800]}"
                if validation_warnings:
                    error_detail += f"\n\nPossible issues: {'; '.join(validation_warnings[:3])}"
                error_detail += "\n\nTip: Try the /latex-to-pdf endpoint instead, which supports more LaTeX packages."
                
                raise HTTPException(
                    status_code=400,
                    detail=error_detail
                )
            
            # Check if PDF was generated
            pdf_file = temp_dir / "document.pdf"
            if not pdf_file.exists():
                raise HTTPException(
                    status_code=500,
                    detail="PDF file was not generated by Tectonic"
                )
            
            # Read and return PDF
            pdf_content = pdf_file.read_bytes()
            logger.info(f"Tectonic generated PDF size: {len(pdf_content)} bytes")
            
            return Response(
                content=pdf_content,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename={request.filename}"
                }
            )
            
        finally:
            # Cleanup
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                logger.warning(f"Failed to cleanup temp directory: {e}")
                
    except subprocess.TimeoutExpired:
        logger.error("Tectonic compilation timed out")
        raise HTTPException(
            status_code=408,
            detail="Tectonic compilation timed out (30 seconds limit)"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in Tectonic compilation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/pdf-to-images")
async def convert_pdf_to_images(file: UploadFile = File(...)) -> JSONResponse:
    """
    Convert PDF file to JPEG images
    
    Args:
        file: PDF file upload
        
    Returns:
        JSON response with list of base64 encoded JPEG images
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(
                status_code=400, 
                detail="File must be a PDF"
            )
        
        # Read PDF content
        pdf_content = await file.read()
        logger.info(f"Processing PDF: {file.filename}, Size: {len(pdf_content)} bytes")
        
        # Convert PDF to images
        try:
            # Convert PDF pages to PIL Images
            # dpi=150 gives good quality, first_page and last_page limit to 3 pages max
            images = convert_from_bytes(
                pdf_content,
                dpi=150,
                first_page=1,
                last_page=3,  # Limit to first 3 pages
                fmt='jpeg'
            )
            
            logger.info(f"Successfully converted PDF to {len(images)} images")
            
        except Exception as e:
            logger.error(f"Error converting PDF: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to convert PDF: {str(e)}"
            )
        
        # Convert images to base64
        base64_images = []
        for i, image in enumerate(images):
            try:
                # Convert PIL Image to JPEG bytes
                img_buffer = io.BytesIO()
                
                # Convert to RGB if necessary (for JPEG compatibility)
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                
                # Save as JPEG with good quality
                image.save(img_buffer, format='JPEG', quality=85, optimize=True)
                img_bytes = img_buffer.getvalue()
                
                # Convert to base64
                base64_image = base64.b64encode(img_bytes).decode('utf-8')
                base64_images.append(base64_image)
                
                logger.info(f"Converted page {i+1} to base64 ({len(base64_image)} chars)")
                
            except Exception as e:
                logger.error(f"Error converting page {i+1} to base64: {str(e)}")
                continue
        
        if not base64_images:
            raise HTTPException(
                status_code=500,
                detail="Failed to convert any pages to images"
            )
        
        return JSONResponse(content={
            "success": True,
            "images": base64_images,
            "page_count": len(base64_images),
            "original_filename": file.filename
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 