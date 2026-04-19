import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Convert file to buffer for Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a promise wrapper
        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    resource_type: 'auto',
                    folder: 'bites-of-bliss' // Organize in a folder
                }, 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({ success: true, url: result.secure_url });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Internal Server Error" 
        }, { status: 500 });
    }
}
