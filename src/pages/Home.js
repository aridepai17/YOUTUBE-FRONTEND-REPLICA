import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import {useAppDispatch,useAppSelector} from "../hooks/useApp";
import { getHomePageVideos } from '../store/reducers/getHomePageVideos';
import Spinner from '../components/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../components/Card';

export default function Home() {

  const dispatch = useAppDispatch();
  const videos = useAppSelector((state)=> state.youtubeApp.videos);

  useEffect(()=>{
    dispatch(getHomePageVideos(false));
  },[dispatch])


  return (
    <div className='max-h-screen overflow-hidden overflow-y-auto overflow-x-hidden'>
      <div style={{height:"7.5vh"}}>
      <Navbar/>
      </div>
      <div className='flex' style={{height:"95vh"}}>
      <Sidebar/>
      {
        videos.length ? (
          <InfiniteScroll 
          dataLength={videos.length} 
          next={()=> dispatch(getHomePageVideos(true))}
          hasMore={videos.length<500}
          loader={<Spinner/>}
          height={1000}
          >
              <div className='grid gap-y-14 gap-x-8 grid-cols-5 p-8'>
                {videos.map((item) => {
                  return <Card data={item} key={item.videoId}/>
                })}
              </div>
          </InfiniteScroll>
        ):(
          <Spinner/>
        )
      }
      </div>
    </div>
  )
}
