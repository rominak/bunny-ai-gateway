import FaIcon from '@/app/components/FaIcon';
import type { ImageValidationResult } from '@/app/types/containers';

interface ImagePreviewCardProps {
  image: string;
  tag: string;
  registry: string;
  validationResult?: ImageValidationResult;
}

export default function ImagePreviewCard({
  image,
  tag,
  registry,
  validationResult,
}: ImagePreviewCardProps) {
  if (!image || !tag) {
    return null;
  }

  const fullImageName = `${image}:${tag}`;
  const isVerified = validationResult?.found === true;
  const isError = validationResult?.found === false;

  return (
    <div className="bg-white rounded-[12px] p-[20px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]">
      <div className="flex items-start gap-[12px]">
        {/* Icon */}
        <div className={`w-[40px] h-[40px] flex items-center justify-center rounded-[8px] ${
          isVerified ? 'bg-green-50' : isError ? 'bg-red-50' : 'bg-amber-50'
        }`}>
          <FaIcon
            icon={isVerified ? 'fas fa-check-circle' : isError ? 'fas fa-times-circle' : 'fas fa-exclamation-triangle'}
            className={isVerified ? 'text-[#16a34a]' : isError ? 'text-[#dc2626]' : 'text-[#f59e0b]'}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <h4 className="text-[14px] font-semibold text-[#243342]">
              {isVerified ? 'Image Verified' : isError ? 'Image Not Found' : 'Image Not Verified'}
            </h4>
          </div>

          {/* Image name */}
          <div className="flex items-center gap-[8px] mb-[8px]">
            <FaIcon icon="fab fa-docker" className="text-[#1870c6]" />
            <code className="text-[13px] text-[#243342] font-mono">
              {fullImageName}
            </code>
          </div>

          {/* Registry */}
          <p className="text-[12px] text-[#687a8b] mb-[12px]">
            Registry: {registry}
          </p>

          {/* Verification details */}
          {isVerified && validationResult && (
            <div className="space-y-[4px]">
              {validationResult.size && (
                <div className="flex items-center gap-[8px] text-[12px]">
                  <span className="text-[#9ba7b2]">Size:</span>
                  <span className="text-[#243342]">{validationResult.size}</span>
                </div>
              )}
              {validationResult.architecture && (
                <div className="flex items-center gap-[8px] text-[12px]">
                  <span className="text-[#9ba7b2]">Architecture:</span>
                  <span className="text-[#243342]">{validationResult.architecture}</span>
                </div>
              )}
              {validationResult.lastUpdated && (
                <div className="flex items-center gap-[8px] text-[12px]">
                  <span className="text-[#9ba7b2]">Last updated:</span>
                  <span className="text-[#243342]">{validationResult.lastUpdated}</span>
                </div>
              )}
            </div>
          )}

          {!validationResult && (
            <p className="text-[12px] text-[#687a8b]">
              Deployment will attempt to pull this image. Make sure it exists in the registry.
            </p>
          )}

          {isError && (
            <p className="text-[12px] text-[#dc2626]">
              This image could not be found in the registry. Please check the image name and tag.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
