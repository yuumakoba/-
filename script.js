document.addEventListener('DOMContentLoaded', () => {
  // --- Google Sheets Configuration ---
  // お客様のGoogleスプレッドシートIDをここに貼り付けてください
  const SPREADSHEET_ID = '1rVMxwnwv_kr9hkiIu8rlBWsxU4j_MkLHNJZYBlJB248';

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isMenuOpen = navLinks.classList.contains('mobile-open');
      menuBtn.innerHTML = isMenuOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
      lucide.createIcons();
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Members Page 3D Carousel Logic
  function initMembersCarousel() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const allCards = document.querySelectorAll('.carousel-item');
    const carouselContainer = document.getElementById('members-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const emptyMessage = document.getElementById('empty-message');

    if (tabBtns.length > 0 && carouselContainer) {
      let currentRotation = 0;
      let activeIndex = 0;
      let visibleCards = [];
      let theta = 0;

      function updateCarousel() {
        if (visibleCards.length === 0) return;

        theta = 360 / visibleCards.length;
        // Calculate radius dynamically based on item width (260px) and item count
        const radius = Math.round((260 / 2) / Math.tan(Math.PI / visibleCards.length)) + 80;

        visibleCards.forEach((card, index) => {
          card.style.transform = `rotateY(${index * theta}deg) translateZ(${radius}px)`;
          card.classList.remove('active-item');
        });

        // Normalize active index
        const normalizedIndex = ((activeIndex % visibleCards.length) + visibleCards.length) % visibleCards.length;
        if (visibleCards[normalizedIndex]) {
          visibleCards[normalizedIndex].classList.add('active-item');
        }

        carouselContainer.style.transform = `translateZ(${-radius}px) rotateY(${currentRotation}deg)`;
      }

      function setActiveTab(grade) {
        tabBtns.forEach(btn => {
          if (btn.getAttribute('data-grade') === grade) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        visibleCards = [];
        allCards.forEach(card => {
          if (card.getAttribute('data-grade') === grade) {
            card.classList.remove('hidden');
            visibleCards.push(card);
          } else {
            card.classList.add('hidden');
          }
        });

        if (emptyMessage) {
          emptyMessage.style.display = visibleCards.length === 0 ? 'block' : 'none';
        }

        currentRotation = 0;
        activeIndex = 0;

        // Allow DOM to update before applying 3D transforms
        setTimeout(() => {
          updateCarousel();
        }, 50);
      }

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const grade = btn.getAttribute('data-grade');
          setActiveTab(grade);
        });
      });

      if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
          if (visibleCards.length === 0) return;
          currentRotation += theta;
          activeIndex--;
          updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
          if (visibleCards.length === 0) return;
          currentRotation -= theta;
          activeIndex++;
          updateCarousel();
        });
      }

      // Default active tab to 4
      setActiveTab('4');
    }
  }

  // Records Page Search Logic
  const searchInput = document.getElementById('record-search');
  const emptyRecordMsg = document.getElementById('empty-record-msg');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      let count = 0;
      const currentRows = document.querySelectorAll('.record-row');

      currentRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = '';
          count++;
        } else {
          row.style.display = 'none';
        }
      });

      if (emptyRecordMsg) {
        emptyRecordMsg.style.display = count === 0 ? 'block' : 'none';
      }
    });
  }

  // Parts Page Circular Navigation Logic
  const circleItems = document.querySelectorAll('.circle-item');
  const detailCards = document.querySelectorAll('.part-detail-card');
  const circleContainer = document.querySelector('.circle-container');

  if (circleItems.length > 0 && circleContainer) {
    let currentOffset = 0;

    circleItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        circleItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Calculate shortest path for rotation
        let delta = index - (currentOffset % 5);
        // Handle negative modulo correctly
        if (delta > 2) delta -= 5;
        if (delta < -2) delta += 5;
        if (delta === 3) delta -= 5; // Extra safety for edge cases
        if (delta === -3) delta += 5;

        currentOffset += delta;
        circleContainer.style.setProperty('--offset', currentOffset);

        detailCards.forEach(card => card.classList.remove('active'));

        const partId = item.getAttribute('data-part');
        const targetCard = document.getElementById(`detail-${partId}`);
        if (targetCard) {
          targetCard.classList.add('active');
        }

        // Update background layers
        const bgLayers = document.querySelectorAll('.parts-bg-layer');
        if (bgLayers.length > 0) {
          bgLayers.forEach(bg => bg.classList.remove('active'));
          const targetBg = document.getElementById(`bg-layer-${partId}`);
          if (targetBg) {
            targetBg.classList.add('active');
          }
        }
      });
    });
  }

  // Scroll Reveal Logic
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, observerOptions);

  function applyScrollReveal() {
    const elementsToReveal = document.querySelectorAll('.card:not(.reveal), .page-title:not(.reveal), .hero-content:not(.reveal), .data-table:not(.reveal), .parts-circle-wrapper:not(.reveal), .member-card:not(.reveal)');
    elementsToReveal.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  applyScrollReveal();

  // Member Card Click Logic
  function initMemberCardClicks() {
    const memberCardsProfile = document.querySelectorAll('.member-card:not(.click-bound)');
    memberCardsProfile.forEach(card => {
      card.classList.add('click-bound');
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const name = card.querySelector('h3')?.textContent || '';
        const partBadge = card.querySelector('.badge');
        const part = partBadge?.textContent || '';
        const pbText = card.querySelector('.member-pb')?.textContent || '';
        const quoteText = card.querySelector('.member-quote')?.textContent || '';

        // "PB: 1'52"34" -> "1'52"34"
        const pb = pbText.replace(/PB:\s*/, '').replace(/Support\s*/, 'サポート').trim();
        const quote = quoteText.replace(/^"|"$/g, '').trim(); // Remove quotes

        // Get avatar color to theme the profile page
        const avatar = card.querySelector('.member-avatar');
        const color = avatar ? getComputedStyle(avatar).borderColor : '#0ea5e9';

        // Get highschool from data attribute if it exists, otherwise default
        const highschool = card.getAttribute('data-highschool') || '未設定 (クリックして編集可能)';

        // Get department from data attribute
        const department = card.getAttribute('data-department') || '未設定 (クリックして編集可能)';

        const params = new URLSearchParams();
        params.append('name', name);
        params.append('part', part);
        params.append('pb', pb);
        params.append('quote', quote);
        params.append('color', color);
        params.append('highschool', highschool);
        params.append('department', department);

        window.location.href = `profile.html?${params.toString()}`;
      });
    });
  }

  initMemberCardClicks();

  // --- Google Sheets Integration ---
  function fetchSheetData(sheetName, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    if (SPREADSHEET_ID === 'ダミーのIDをここに入れます_後で書き換えてください') {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-muted);">ダミーIDのため読み込みをスキップしました。<br>正しいスプレッドシートIDを設定してください。</td></tr>';
      return;
    }

    // ローカル環境（file:///）でのCORSエラーを回避するため、JSONPを使用します
    const callbackName = 'gvizCallback_' + tbodyId.replace(/-/g, '_') + '_' + Date.now();
    const queryUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent(sheetName)}`;

    window[callbackName] = function(data) {
      tbody.innerHTML = ''; // Clear loading message

      if (!data.table.rows || data.table.rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">データがありません</td></tr>';
      } else {
        let skipHeader = true;
        data.table.rows.forEach(row => {
          if (!row.c || !row.c[0] || row.c[0].v === null) return; // Skip empty rows

          // APIがヘッダー行をデータとして返すことがあるためスキップ
          if (skipHeader && row.c[0].v === '種目') {
            skipHeader = false;
            return;
          }
          skipHeader = false;

          // Extract values handling potential nulls
          const event = row.c[0] && row.c[0].v !== null ? row.c[0].v : '-';
          const record = row.c[1] && row.c[1].v !== null ? (row.c[1].f || row.c[1].v) : '-';
          const name = row.c[2] && row.c[2].v !== null ? row.c[2].v : '-';
          let year = '-';
          if (row.c[3] && row.c[3].v !== null) {
            year = row.c[3].f || row.c[3].v;
          }

          const tr = document.createElement('tr');
          tr.className = 'record-row';
          tr.innerHTML = `
            <td style="font-weight: 600; color: var(--primary);">${event}</td>
            <td style="font-size: 1.2rem; font-family: monospace;">${record}</td>
            <td>${name}</td>
            <td style="color: var(--text-muted);">${year}</td>
          `;
          tbody.appendChild(tr);
        });

        // データ読み込み後に検索を再適用（入力がある場合）
        const searchInput = document.getElementById('record-search');
        if (searchInput && searchInput.value) {
          searchInput.dispatchEvent(new Event('input'));
        }
      }

      // クリーンアップ
      delete window[callbackName];
      const scriptToRemove = document.getElementById(callbackName);
      if (scriptToRemove) scriptToRemove.remove();
    };

    const script = document.createElement('script');
    script.src = queryUrl;
    script.id = callbackName;
    script.onerror = function() {
      console.error('Error fetching sheet data');
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: red;">データの読み込みに失敗しました。URLや共有設定を確認してください。</td></tr>';
      delete window[callbackName];
      script.remove();
    };
    document.head.appendChild(script);
  }

  function fetchMembersData() {
    const container = document.getElementById('members-carousel');
    if (!container) return;

    if (SPREADSHEET_ID === 'ダミーのIDをここに入れます_後で書き換えてください') {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">ダミーIDのため読み込みをスキップしました。</p>';
      return;
    }

    const callbackName = 'gvizCallback_members_' + Date.now();
    const queryUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent('メンバー')}`;

    window[callbackName] = function(data) {
      container.innerHTML = ''; // プレースホルダーをクリア

      if (!data.table.rows || data.table.rows.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">データがありません</p>';
      } else {
        let skipHeader = true;
        
        // 学年ごとのカラー設定
        const gradeColors = {
          '4': '#0ea5e9', // 青
          '3': '#f43f5e', // 赤
          '2': '#10b981', // 緑
          '1': '#8b5cf6'  // 紫
        };

        data.table.rows.forEach(row => {
          if (!row.c || !row.c[0] || row.c[0].v === null) return;
          if (skipHeader && row.c[0].v === '学年') {
            skipHeader = false;
            return;
          }
          skipHeader = false;

          const grade = row.c[0] && row.c[0].v !== null ? row.c[0].v.toString() : '';
          const name = row.c[1] && row.c[1].v !== null ? row.c[1].v : '';
          const part = row.c[2] && row.c[2].v !== null ? row.c[2].v : '';
          const pb = row.c[3] && row.c[3].v !== null ? row.c[3].v : '';
          const quote = row.c[4] && row.c[4].v !== null ? row.c[4].v : '';
          const highschool = row.c[5] && row.c[5].v !== null ? row.c[5].v : '未設定 (クリックして編集可能)';
          const department = row.c[6] && row.c[6].v !== null ? row.c[6].v : '未設定 (クリックして編集可能)';

          const color = gradeColors[grade] || '#0ea5e9';

          // 記録アイコン (サポートの場合はタイマー)
          const pbIcon = pb.toLowerCase().includes('support') || pb === 'サポート' ? 'timer' : 'award';
          const pbDisplay = pbIcon === 'timer' ? 'Support' : `PB: ${pb}`;

          const div = document.createElement('div');
          div.className = 'carousel-item member-card hidden';
          div.setAttribute('data-grade', grade);
          div.setAttribute('data-highschool', highschool);
          div.setAttribute('data-department', department);

          div.innerHTML = `
            <div class="member-avatar" style="border-color: ${color};"><i data-lucide="user" width="40" height="40" color="${color}"></i></div>
            <h3>${name}</h3>
            <div class="badge" style="background-color: ${color}33; color: ${color};">${part}</div>
            <p class="member-pb"><i data-lucide="${pbIcon}" width="16" height="16"></i> ${pbDisplay}</p>
            <p class="member-quote">"${quote}"</p>
          `;
          container.appendChild(div);
        });

        // 動的追加後に再描画・初期化
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        initMembersCarousel();
        initMemberCardClicks();
        applyScrollReveal();
      }

      delete window[callbackName];
      const scriptToRemove = document.getElementById(callbackName);
      if (scriptToRemove) scriptToRemove.remove();
    };

    const script = document.createElement('script');
    script.src = queryUrl;
    script.id = callbackName;
    script.onerror = function() {
      console.error('Error fetching members data');
      container.innerHTML = '<p style="text-align: center; color: red;">データの読み込みに失敗しました。</p>';
      delete window[callbackName];
      script.remove();
    };
    document.head.appendChild(script);
  }

  // Trigger data fetching for respective pages
  if (document.getElementById('all-time-records-tbody')) {
    fetchSheetData('歴代記録', 'all-time-records-tbody');
  }

  if (document.getElementById('last-year-records-tbody')) {
    fetchSheetData('去年の記録', 'last-year-records-tbody');
  }

  if (document.getElementById('members-carousel')) {
    fetchMembersData();
  }
});
