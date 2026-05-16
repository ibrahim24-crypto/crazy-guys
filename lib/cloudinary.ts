/**
 * Cloudinary utilities for image and video uploads
 * Requires: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and upload presets in .env
 */

export type MediaType = 'image' | 'video';

export const uploadMediaToCloudinary = async (
  file: File,
  mediaType: MediaType = 'image'
): Promise<string | null> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  let uploadPreset: string | undefined;
  if (mediaType === 'image') {
    uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_IMAGE;
  } else {
    uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_VIDEO;
  }

  if (!cloudName || !uploadPreset) {
    console.error(
      `Cloudinary configuration missing for ${mediaType}. ` +
      `Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and ` +
      `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_${mediaType.toUpperCase()} to .env.local`
    );
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const resourceType = mediaType === 'video' ? 'video' : 'image';
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary ${mediaType} upload failed`);
    }

    const data = await response.json();
    return data.secure_url; // Returns the secure HTTPS URL
  } catch (error) {
    console.error(`Error uploading ${mediaType} to Cloudinary:`, error);
    return null;
  }
};

/**
 * Upload image to Cloudinary
 */
export const uploadImageToCloudinary = (file: File): Promise<string | null> => {
  return uploadMediaToCloudinary(file, 'image');
};

/**
 * Upload video to Cloudinary
 */
export const uploadVideoToCloudinary = (file: File): Promise<string | null> => {
  return uploadMediaToCloudinary(file, 'video');
};

/**
 * Optimize Cloudinary media URL
 * Adds transformations for better performance
 */
export const optimizeCloudinaryUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  if (!url.includes('cloudinary')) {
    return url; // Not a Cloudinary URL, return as-is
  }

  // Insert transformation parameters
  const params = [];
  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  params.push(`q_${quality}`);
  params.push('f_auto'); // Auto format selection

  const transformations = params.join(',');
  return url.replace('/upload/', `/upload/${transformations}/`);
};

/**
 * Generate Cloudinary video thumbnail
 */
export const getCloudinaryVideoThumbnail = (
  videoUrl: string,
  width: number = 400,
  height: number = 300
): string => {
  // Replace /upload/ with /upload/w_<width>,h_<height>,c_fill/so_0s/ to get thumbnail
  const transformations = `w_${width},h_${height},c_fill/so_0s`;
  return videoUrl.replace('/upload/', `/upload/${transformations}/`);
};

