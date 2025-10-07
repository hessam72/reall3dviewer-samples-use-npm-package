import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ErrorPageProps {
    title?: string;
    message?: string;
    code?: string | number;
}

export default function ErrorPage({
    title = 'صفحه مورد نظر یافت نشد',
    message = 'متاسفانه صفحه‌ای که به دنبال آن هستید در دسترس نیست',
    code = '404'
}: ErrorPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Error Icon or Image */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                    <Image
                        src="/404-car.svg"
                        alt="خطا"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Error Code */}
                <div className="text-6xl font-bold text-gray-900 font-vazir">
                    {code}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 font-vazir">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-gray-600 font-vazir">
                    {message}
                </p>

                {/* Return Button */}
                <Link
                    href="/"
                    className="inline-block px-6 py-3 mt-8 text-white bg-blue-600 rounded-lg 
                             hover:bg-blue-700 transition-colors duration-200 font-vazir
                             ios-glass-theme"
                >
                    بازگشت به صفحه اصلی
                </Link>
            </div>
        </div>
    );
}