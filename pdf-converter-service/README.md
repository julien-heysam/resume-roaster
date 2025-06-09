# PDF Converter Service

A FastAPI service that converts PDF files to JPEG images and compiles LaTeX code to PDF documents.

## Features

- **PDF to Images**: Convert PDF files to JPEG images (up to 3 pages)
- **LaTeX to PDF**: Compile LaTeX code to PDF documents
- **Multiple LaTeX Engines**: Support for both traditional LaTeX and Tectonic
- **Heroku Ready**: Configured for easy deployment on Heroku

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

### LaTeX Compilation
- `POST /latex-to-pdf` - Compile LaTeX using traditional engines (pdflatex)
- `POST /latex-to-pdf-tectonic` - Compile LaTeX using Tectonic (lightweight alternative)

### PDF Processing
- `POST /pdf-to-images` - Convert PDF to JPEG images

## Local Development

### Prerequisites
- Python 3.8+
- LaTeX distribution (TeX Live recommended)
- poppler-utils (for PDF to image conversion)

### Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Run the service
python app.py
```

The service will be available at `http://localhost:8000`

### Testing
```bash
# Test the service
python test_latex.py

# Test with custom URL
python test_latex.py https://your-app.herokuapp.com
```

## Heroku Deployment

### 1. Setup Buildpacks
```bash
# Make the setup script executable
chmod +x setup-heroku.sh

# Run the setup script
./setup-heroku.sh
```

Or manually:
```bash
# Add LaTeX buildpack
heroku buildpacks:add https://github.com/Thermondo/heroku-buildpack-tex

# Add Python buildpack
heroku buildpacks:add heroku/python
```

### 2. Deploy
```bash
git add .
git commit -m "Add LaTeX compilation service"
git push heroku main
```

### 3. Verify Deployment
```bash
# Check logs
heroku logs --tail

# Test the service
python test_latex.py https://your-app.herokuapp.com
```

## API Usage Examples

### LaTeX to PDF
```python
import requests

latex_code = r"""
\documentclass{article}
\begin{document}
\title{My Document}
\maketitle
Hello, World!
\end{document}
"""

response = requests.post(
    "https://your-app.herokuapp.com/latex-to-pdf",
    json={
        "latex_code": latex_code,
        "filename": "my_document.pdf"
    }
)

if response.status_code == 200:
    with open("output.pdf", "wb") as f:
        f.write(response.content)
```

### PDF to Images
```python
import requests

with open("document.pdf", "rb") as f:
    response = requests.post(
        "https://your-app.herokuapp.com/pdf-to-images",
        files={"file": f}
    )

if response.status_code == 200:
    data = response.json()
    images = data["images"]  # Base64 encoded JPEG images
```

## Troubleshooting

### LaTeX Compilation Issues
1. **Engine not found**: Try the Tectonic endpoint (`/latex-to-pdf-tectonic`)
2. **Compilation errors**: Check the error message for specific LaTeX issues
3. **Timeout**: Complex documents may need optimization

### Heroku Deployment Issues
1. **Buildpack errors**: Ensure both LaTeX and Python buildpacks are added
2. **Memory issues**: LaTeX compilation can be memory-intensive
3. **Timeout**: Heroku has a 30-second request timeout

### Common LaTeX Packages
The service includes common packages:
- `amsmath`, `amsfonts`, `amssymb` - Mathematics
- `inputenc` - Character encoding
- `geometry` - Page layout
- `graphicx` - Images

For additional packages, they should be available in the TeX Live distribution included with the buildpack.

## Environment Variables

- `PORT` - Server port (default: 8000)
- `TEXMFCACHE` - LaTeX cache directory (auto-configured)
- `TEXMFVAR` - LaTeX variable directory (auto-configured)

## Limitations

- PDF to image conversion limited to first 3 pages
- LaTeX compilation timeout: 30 seconds
- Maximum file size depends on Heroku limits
- Some advanced LaTeX packages may not be available 