
import React from "react";
import YouTube from "react-youtube";
  
export default function YouTubeVid(props){
    const {videoId, height, width} = props;
    
    const getOpts = () => ({
        height,
        width,
        playerVars: {autoplay: 0},
    });
  
    return (
        <div>
            <YouTube videoId={videoId} opts={getOpts()} />
        </div>
    );
}
