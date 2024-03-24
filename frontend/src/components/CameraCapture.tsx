import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import CaptureIcon from './CaptureIcon.svg';
import UploadIcon from './UploadIcon.svg'; // Import your UploadIcon

const CameraCapture = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string>("Result will appear here");

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const predictionToContainer = () => {
    if (prediction === "Result will appear here")
        return ""
    if (prediction === "cardboard" || prediction === "paper")
        return "blue"
    if (prediction === "glass")
        return "green"
    if (prediction === "metal" || prediction === "plastic")
        return "yellow"
    if (prediction === "trash")
        return "black"
  }

  const submitImage = async () => {
    if (imgSrc) {
      const base64Image = imgSrc.split(',')[1];

      try {
        const response = await fetch('http://localhost:5000/scanner/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ image: base64Image }),
        })

        if (response.status === 401) {
            window.location.href = '/login';
        }

        if (response.ok) {
          const data = await response.json();
          console.log(data);
            setPrediction(data.prediction);
        } else {
          console.error('Error in response:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };

  const retryCapture = () => {
    setImgSrc(null);
    setPrediction("Result will appear here");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-2xl text-center py-4">Scan</h1>
      <div className="">
        {!imgSrc ? (
          <Webcam audio={false} ref={webcamRef} className="mx-auto" />
        ) : (
          <img src={imgSrc} alt="Captured" className="mx-auto" />
        )}
      </div>
      <div className="flex flex-col items-center p-4">
      {!imgSrc && (
        <>
          <button onClick={capture} className="bg-green-500 text-white px-4 py-2 rounded mt-2 mb-6"> {/* Add margin top */}
            Capture photo
          </button>
        

        
        <label htmlFor="upload-button" className="cursor-pointer mb-2">
          <img src={UploadIcon} alt="Upload" className="h-6 w-6" />
        </label>
        <p className="text-xs text-gray-600">or upload from gallery</p> {/* Add descriptive text */}
        
        <input
          id="upload-button"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        </>
        )}
      </div>
      <div className="flex-auto flex flex-col">
        <div className="bg-white border border-gray-300 p-4 mx-4 my-2 rounded">
          <p className='text-center text-bold'>Detected {prediction.charAt(0).toUpperCase() + prediction.slice(1)}</p>
          {prediction !== "Result will appear here" && (
            <p className={`text-center text-bold text-${predictionToContainer()}-500`}>Dispose in the {predictionToContainer()} bin</p>
          )}
        </div>
        <div className="flex justify-around p-4">
          {imgSrc && prediction === "Result will appear here" ? (
            <>
              <button onClick={submitImage} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
              <button onClick={retryCapture} className="bg-red-500 text-white px-4 py-2 rounded">Retry</button>
            </>
          ) : null}
          {prediction !== "Result will appear here" && <button onClick={retryCapture} className="bg-blue-500 text-white px-4 py-2 rounded">New Scan</button>}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
