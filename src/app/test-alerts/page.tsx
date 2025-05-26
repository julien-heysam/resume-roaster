"use client"

import { useAlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function TestAlertsPage() {
  const { showAlert, AlertDialog } = useAlertDialog()

  const testInfoAlert = () => {
    showAlert({
      title: "Information",
      description: "This is an info alert dialog with the application's theme.",
      type: "info",
      confirmText: "Got it"
    })
  }

  const testSuccessAlert = () => {
    showAlert({
      title: "Success",
      description: "This is a success alert dialog with the application's theme.",
      type: "success",
      confirmText: "Awesome"
    })
  }

  const testWarningAlert = () => {
    showAlert({
      title: "Warning",
      description: "This is a warning alert dialog with the application's theme.",
      type: "warning",
      confirmText: "Understood"
    })
  }

  const testErrorAlert = () => {
    showAlert({
      title: "Error",
      description: "This is an error alert dialog with the application's theme.",
      type: "error",
      confirmText: "OK"
    })
  }

  const testConfirmAlert = () => {
    showAlert({
      title: "Confirm Action",
      description: "Are you sure you want to proceed with this action?",
      type: "warning",
      confirmText: "Yes, proceed",
      cancelText: "Cancel",
      onConfirm: () => {
        showAlert({
          title: "Confirmed",
          description: "You confirmed the action!",
          type: "success",
          confirmText: "OK"
        })
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-8">
          Alert Dialog Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            onClick={testInfoAlert}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Test Info Alert
          </Button>
          
          <Button 
            onClick={testSuccessAlert}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Test Success Alert
          </Button>
          
          <Button 
            onClick={testWarningAlert}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Test Warning Alert
          </Button>
          
          <Button 
            onClick={testErrorAlert}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Test Error Alert
          </Button>
          
          <Button 
            onClick={testConfirmAlert}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            Test Confirm Dialog
          </Button>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <p className="text-gray-600">
            Click the buttons above to test different types of alert dialogs. 
            Each should display with the appropriate theme colors and icons.
          </p>
        </div>
      </div>

      {/* Alert Dialog */}
      {AlertDialog}
    </div>
  )
} 