/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import FaIcon from '../FaIcon';

export type FileUploadingVariant = 'default' | 'uploaded' | 'withFileStatus' | 'error';

export type FileUploadingFile = {
  id: string;
  name: string;
  sizeBytes: number;
};

export type FileUploadingProps = {
  className?: string;
  /**
   * Visual variant. If omitted, the component infers:
   * - withFileStatus when files exist
   * - default otherwise
   */
  variant?: FileUploadingVariant;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  supportedText?: string;
  buttonText?: string;
  browseText?: string;
  errorText?: string;
  /**
   * Controlled file list (kept small + serializable).
   * If you want raw File objects, use onFilesSelected.
   */
  files?: FileUploadingFile[];
  defaultFiles?: FileUploadingFile[];
  onFilesChange?: (files: FileUploadingFile[]) => void;
  onFilesSelected?: (files: File[]) => void;
};

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)}Mb`;
  const kb = bytes / 1024;
  if (kb >= 1) return `${Math.max(1, Math.round(kb))}Kb`;
  return `${Math.max(1, bytes)}B`;
}

function makeId(name: string, size: number) {
  // Stable enough for UI usage, not for security.
  return `${name}:${size}:${Math.random().toString(16).slice(2)}`;
}

export default function FileUploading({
  className = '',
  variant,
  disabled = false,
  accept = '.pdf,.xls,.doc,.docx',
  multiple = false,
  maxFiles = multiple ? 10 : 1,
  supportedText = 'Supported: PDF, XLS, DOC, DOCX',
  buttonText = 'Drag & Drop to Upload',
  browseText = 'Browse',
  errorText,
  files,
  defaultFiles,
  onFilesChange,
  onFilesSelected,
}: FileUploadingProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = files !== undefined;
  const [uncontrolled, setUncontrolled] = useState<FileUploadingFile[]>(defaultFiles ?? []);
  const currentFiles = isControlled ? files : uncontrolled;

  const inferredVariant: FileUploadingVariant = useMemo(() => {
    if (variant) return variant;
    if (currentFiles.length > 0) return 'withFileStatus';
    return 'default';
  }, [currentFiles.length, variant]);

  const [isDragging, setIsDragging] = useState(false);

  const setFiles = useCallback((next: FileUploadingFile[]) => {
    if (!isControlled) setUncontrolled(next);
    onFilesChange?.(next);
  }, [isControlled, onFilesChange]);

  const openPicker = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const addSelectedFiles = useCallback((selected: File[]) => {
    if (disabled) return;

    onFilesSelected?.(selected);

    const asUiFiles: FileUploadingFile[] = selected.map((f) => ({
      id: makeId(f.name, f.size),
      name: f.name,
      sizeBytes: f.size,
    }));

    const merged = multiple ? [...currentFiles, ...asUiFiles] : asUiFiles;
    setFiles(merged.slice(0, Math.max(1, maxFiles)));
  }, [currentFiles, disabled, maxFiles, multiple, onFilesSelected, setFiles]);

  const onInputChange = useCallback(() => {
    const el = inputRef.current;
    if (!el?.files?.length) return;
    addSelectedFiles(Array.from(el.files));
    // allow selecting same file again
    el.value = '';
  }, [addSelectedFiles]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files ?? []);
    if (!dropped.length) return;
    addSelectedFiles(dropped);
  }, [addSelectedFiles, disabled]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(currentFiles.filter((f) => f.id !== id));
  }, [currentFiles, setFiles]);

  const outerStyles = useMemo(() => {
    const base = 'border border-dashed rounded-[8px] w-full';
    const padding = inferredVariant === 'default' ? 'p-[32px]' : 'p-[20px]';
    const dragging = isDragging ? ' ring-2 ring-[#1870c6]/20 border-[#c4cdd5]' : '';

    if (inferredVariant === 'uploaded') {
      return `${base} ${padding} bg-[#f2faf5] border-[#c8ead6] ${dragging}`;
    }
    if (inferredVariant === 'error') {
      return `${base} ${padding} bg-[#fff3f2] border-[#fda29b] ${dragging}`;
    }
    return `${base} ${padding} bg-white border-[#e6e9ec] ${dragging}`;
  }, [inferredVariant, isDragging]);

  const showFileStatus = inferredVariant === 'withFileStatus' && currentFiles.length > 0;

  return (
    <div className={`${outerStyles} ${className}`.trim()}>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onInputChange}
      />

      <div
        className="flex flex-col items-center justify-center gap-[10px] text-center"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        aria-disabled={disabled}
      >
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className={`h-[44px] px-[16px] py-[10px] bg-white border border-[#cdd3d8] rounded-[6px] inline-flex items-center justify-center gap-[5px] transition-colors ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#f8fafc]'
          }`}
        >
          <FaIcon icon="fas fa-file-lines" className="text-[12px] text-[#364e65]" ariaLabel="" />
          <span className="text-[14px] font-semibold text-[#364e65] leading-[18px]">{buttonText}</span>
        </button>

        <div className="flex flex-col items-center gap-[5px]">
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            className={`text-[14px] leading-[20px] text-[#23599f] ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'hover:underline'
            }`}
          >
            {browseText}
          </button>
          <p className="text-[12px] leading-[14px] text-[#364e65]">{supportedText}</p>
        </div>
      </div>

      {showFileStatus && (
        <div className="mt-[10px] w-full">
          {currentFiles.slice(0, maxFiles).map((f) => (
            <div
              key={f.id}
              className="w-full flex items-center gap-[8px] border border-[#cdd3d8] rounded-[6px] px-[10px] py-[4px] bg-white"
            >
              <FaIcon icon="fas fa-file-lines" className="text-[14px] text-[#364e65]" ariaLabel="File" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold leading-[15px] text-[#243342] truncate">{f.name}</p>
                <p className="text-[12px] font-normal leading-[14px] text-[#364e65]">{formatBytes(f.sizeBytes)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="w-[24px] h-[24px] inline-flex items-center justify-center rounded-[6px] hover:bg-[#f3f4f5] transition-colors"
                aria-label={`Remove ${f.name}`}
              >
                <FaIcon icon="fas fa-xmark" className="text-[12px] text-[#687a8b]" ariaLabel="" />
              </button>
            </div>
          ))}
        </div>
      )}

      {inferredVariant === 'error' && errorText && (
        <p className="mt-[8px] text-[12px] leading-[14px] text-[#b42318]">{errorText}</p>
      )}
    </div>
  );
}





