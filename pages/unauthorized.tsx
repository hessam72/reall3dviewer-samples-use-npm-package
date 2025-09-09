import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

const UnauthorizedPage = () => {
    return (
        <div className="unauthorized-container">
            <Head>
                <title>دسترسی غیرمجاز</title>
                <meta name="theme-color" content="#111827" />
            </Head>

            <main>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="content-wrapper"
                >
                    <div className="icon-wrapper">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="rotating-circle"
                        />
                        <svg
                            className="lock-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                    </div>

                    <h1>دسترسی غیرمجاز</h1>
                    <p className="main-message">شما اجازه دسترسی به این صفحه را ندارید</p>
                    <p className="sub-message">لطفاً با کد دسترسی معتبر تلاش کنید</p>


                </motion.div>
            </main>

            <style jsx global>{`
        body {
          margin: 0;
          background-color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
      `}</style>

            <style jsx>{`
        .unauthorized-container {
          min-height: 100vh;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          direction: rtl;
          color: #fff;
        }

        .content-wrapper {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .icon-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
        }

        .rotating-circle {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #60A5FA;
          border-radius: 50%;
        }

        .lock-icon {
          position: relative;
          width: 60px;
          height: 60px;
          color: #60A5FA;
          margin: 30px;
        }

        h1 {
          color: #fff;
          font-size: 2.5rem;
          margin: 0 0 1rem;
          font-weight: 700;
          background: linear-gradient(to right, #60A5FA, #93C5FD);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-message {
          color: #E5E7EB;
          font-size: 1.25rem;
          margin: 1rem 0;
          font-weight: 500;
        }

        .sub-message {
          color: #9CA3AF;
          margin: 0.5rem 0 2rem;
          font-size: 1rem;
        }

        .back-button {
          background: linear-gradient(to right, #3B82F6, #60A5FA);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        @media (max-width: 640px) {
          .content-wrapper {
            padding: 2rem 1.5rem;
          }

          h1 {
            font-size: 2rem;
          }

          .icon-wrapper {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
        </div>
    );
};

export default UnauthorizedPage;