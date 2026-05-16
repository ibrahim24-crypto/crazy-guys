/**
 * API route for Cloudinary uploads
 * POST /api/upload
 * Body: { file: File, type: 'image' | 'video' }
 */

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mediaType = (formData.get('type') as string) || 'image';

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    let uploadPreset: string | undefined;

    if (mediaType === 'image') {
      uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_IMAGE;
    } else if (mediaType === 'video') {
      uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_VIDEO;
    }

    if (!cloudName || !uploadPreset) {
      return Response.json(
        { error: `Cloudinary configuration missing for ${mediaType}` },
        { status: 500 }
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', uploadPreset);

    const resourceType = mediaType === 'video' ? 'video' : 'image';
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json({
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      mediaType: mediaType,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    );
  }
}
