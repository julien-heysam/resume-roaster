import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C12 2 7 5 7 10C7 12.5 8.5 14.5 10.5 15.5C9.5 13.5 10.5 11.5 12 11.5C13.5 11.5 14.5 13.5 13.5 15.5C15.5 14.5 17 12.5 17 10C17 5 12 2 12 2Z"
            fill="white"
          />
          <path
            d="M12 11.5C12 11.5 9 13 9 16C9 17.5 10 19 11.5 19.5C10.5 17.5 11.5 16.5 12 16.5C12.5 16.5 13.5 17.5 12.5 19.5C14 19 15 17.5 15 16C15 13 12 11.5 12 11.5Z"
            fill="white"
            opacity="0.8"
          />
          <path
            d="M12 16.5C12 16.5 10.5 17.5 10.5 19C10.5 19.5 11 20 12 20C13 20 13.5 19.5 13.5 19C13.5 17.5 12 16.5 12 16.5Z"
            fill="white"
            opacity="0.6"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
} 