import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

const RobotModel = ({ sceneUrl }) => {
    return (
        <div className="w-full h-[400px] md:h-[600px] relative overflow-hidden group">
            {/* CSS Hack to attempt to hide the logo badge */}
            <style>{`
        canvas + div {
          display: none !important;
        }
        #spline-logo {
          display: none !important;
        }
      `}</style>
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <Spline
                    scene={sceneUrl || "https://prod.spline.design/Q4NvC1lKwzfYMgBR/scene.splinecode"}
                />
            </Suspense>
        </div>
    );
};

export default RobotModel;
