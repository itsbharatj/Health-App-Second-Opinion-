import { useEffect, useRef } from 'react';

interface SleepData {
  day: string;
  hours: number;
  quality: number;
}

const SleepChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sleepData: SleepData[] = [
    { day: 'Mon', hours: 7.2, quality: 85 },
    { day: 'Tue', hours: 6.8, quality: 75 },
    { day: 'Wed', hours: 7.5, quality: 90 },
    { day: 'Thu', hours: 7.0, quality: 80 },
    { day: 'Fri', hours: 7.8, quality: 92 },
    { day: 'Sat', hours: 8.2, quality: 95 },
    { day: 'Sun', hours: 7.5, quality: 88 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 5;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    ctx.clearRect(0, 0, width, height);

    const maxHours = Math.max(...sleepData.map(d => d.hours));
    const minHours = Math.min(...sleepData.map(d => d.hours));
    const range = maxHours - minHours || 1;

    const points: { x: number; y: number }[] = sleepData.map((data, index) => {
      const x = padding + (index / (sleepData.length - 1)) * chartWidth;
      const normalizedValue = (data.hours - minHours) / range;
      const y = padding + chartHeight - (normalizedValue * chartHeight);
      return { x, y };
    });

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        const prevPoint = points[index - 1];
        const midX = (prevPoint.x + point.x) / 2;
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, (prevPoint.y + point.y) / 2);
        ctx.quadraticCurveTo(point.x, point.y, point.x, point.y);
      }
    });
    ctx.stroke();

    points.forEach((point) => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, []);

  const avgSleep = (sleepData.reduce((sum, d) => sum + d.hours, 0) / sleepData.length).toFixed(1);
  const avgQuality = Math.round(sleepData.reduce((sum, d) => sum + d.quality, 0) / sleepData.length);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '4px',
        padding: '0 4px'
      }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>{avgSleep}h</div>
          <div style={{ fontSize: '11px', color: '#6c757d' }}>Avg sleep</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>{avgQuality}%</div>
          <div style={{ fontSize: '11px', color: '#6c757d' }}>Quality</div>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '70px',
          display: 'block'
        }}
      />
    </div>
  );
};

export default SleepChart;
