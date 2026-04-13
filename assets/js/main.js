// Crear burbujas flotantes
  const container = document.getElementById('bubbles');
  const colors = ['#f4a7c0','#9ac4e8','#c9b8e8','#b8e8d4','#fce0cc','#e8c97a'];
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 80 + 30;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*15+10}s;
      animation-delay:${Math.random()*10}s;
    `;
    container.appendChild(b);
  }
