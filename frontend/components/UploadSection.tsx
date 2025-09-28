import React, { useRef } from "react";

type UploadSectionProps = {
  onFileChange: (file: File) => void;
  videoUrl?: string | null;
  disabled?: boolean;
};

const UploadSection: React.FC<UploadSectionProps> = ({
  onFileChange,
  videoUrl,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl mb-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          Upload Video (mp4)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {videoUrl && (
        <div className="mt-2">
          <label className="block text-sm text-gray-600 font-medium mb-1">
            Preview:
          </label>
          <video
            src={videoUrl}
            controls
            className="w-full rounded-xl border"
            style={{ maxHeight: 280 }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadSection;

