export function goodreadsCard() {
  const element = document.createElement('section');
  element.className = 'goodreads-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Dance of Shadows book entry and incoming call');
  element.innerHTML = `
    <div class="s23-device">
      <div class="s23-screen">
        <section class="goodreads-screen">
          <div class="goodreads-status"><span class="status-time">1:18</span><span class="status-icons" aria-label="Wi-Fi, mobile signal, battery 77 percent"><svg class="status-wifi" viewBox="0 0 20 16" aria-hidden="true"><path d="M1 5.5a13.5 13.5 0 0 1 18 0M4 8.5a9 9 0 0 1 12 0M7.2 11.5a4.2 4.2 0 0 1 5.6 0M9.2 14a1.1 1.1 0 1 1 1.6 0"/></svg><svg class="status-signal" viewBox="0 0 16 14" aria-hidden="true"><path d="M1 13h2V9H1zM5 13h2V6H5zM9 13h2V3H9zM13 13h2V0h-2z" fill="currentColor" stroke="none"/></svg><span class="status-percent">77%</span><svg class="status-battery-icon" viewBox="0 0 19 13" aria-hidden="true"><path d="M2 1h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z" fill="currentColor"/><path d="M17 4h1.5v5H17z" fill="currentColor"/><path d="M3 3h9.5v7H3z" fill="#253037" opacity=".38"/></svg></span></div>
          <article class="goodreads-book">
            <div class="goodreads-hero">
              <button class="book-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>
              <button class="book-share" aria-label="Share book"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 11v9h14v-9"/></svg></button>
              <img class="goodreads-cover" src="./assets/gift20-dance-of-shadows-cover.png" alt="Dance of Shadows book cover">
              <div class="cover-pages" aria-label="Cover 1 of 3"><i class="is-current"></i><i></i><i></i></div>
            </div>
            <section class="goodreads-details">
              <h1>Dance of Shadows</h1>
              <p class="goodreads-series">(The Raag of Rta #2)</p>
              <p class="goodreads-author">by Gourav Mohanty</p>
              <p class="goodreads-rating-summary"><span aria-label="4.1 out of 5 stars">★★★★<i>★</i></span><span>4.10 · 236 ratings · 84 reviews</span></p>
              <div class="goodreads-read" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3 17.25 11.06-11.06 3.75 3.75L6.75 21H3v-3.75ZM16.18 4.07l1.77-1.77a1 1 0 0 1 1.41 0l2.34 2.34a1 1 0 0 1 0 1.41l-1.77 1.77-3.75-3.75ZM3 22h18"/></svg><b>Read</b></div>
              <div class="goodreads-rating" aria-label="Rate this book from one half to five stars">
                <div class="goodreads-stars" aria-hidden="true"><span class="goodreads-stars-base">☆☆☆☆☆</span><span class="goodreads-stars-fill">★★★★★</span></div>
                <div class="goodreads-rating-hits"></div>
              </div>
              <p class="rate-label">Rate this book</p>
            </section>
          </article>
        </section>
        <section class="android-call" hidden aria-label="Incoming call">
          <div class="call-status"><span class="status-time">1:18</span><span class="status-icons" aria-label="Wi-Fi, mobile signal, battery 77 percent"><svg class="status-wifi" viewBox="0 0 20 16" aria-hidden="true"><path d="M1 5.5a13.5 13.5 0 0 1 18 0M4 8.5a9 9 0 0 1 12 0M7.2 11.5a4.2 4.2 0 0 1 5.6 0M9.2 14a1.1 1.1 0 1 1 1.6 0"/></svg><svg class="status-signal" viewBox="0 0 16 14" aria-hidden="true"><path d="M1 13h2V9H1zM5 13h2V6H5zM9 13h2V3H9zM13 13h2V0h-2z" fill="currentColor" stroke="none"/></svg><span class="status-percent">77%</span><svg class="status-battery-icon" viewBox="0 0 19 13" aria-hidden="true"><path d="M2 1h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z" fill="currentColor"/><path d="M17 4h1.5v5H17z" fill="currentColor"/><path d="M3 3h9.5v7H3z" fill="#253037" opacity=".38"/></svg></span></div>
          <p class="call-kicker">Incoming call</p>
          <div class="call-contact">
            <h2>Gourav Mohanty</h2>
            <p>Bhubaneswar</p>
            <img src="./assets/gift20-gourav-mohanty.png" alt="Gourav Mohanty">
          </div>
          <div class="call-actions">
            <button type="button" class="call-answer" aria-label="Answer call"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 4c-2 0-4 2-4 4 0 10 10 20 20 20 2 0 4-2 4-4v-3l-7-3-3 4c-4-2-6-4-8-8l4-3-3-7H8Z"/></svg></button>
            <button type="button" class="call-decline" aria-label="Decline call"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 17.2c7.1-7.1 18.9-7.1 26 0l-4.1 6.1-5.8-3.1.2-3.1a13.2 13.2 0 0 0-6.6 0l.2 3.1-5.8 3.1L3 17.2Z"/></svg></button>
          </div>
          <button type="button" class="call-end" aria-label="End call" hidden><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 20c7-7 17-7 24 0l-4 6-6-3v-3a8 8 0 0 0-4 0v3l-6 3-4-6Z"/></svg></button>
          <section class="call-video-stage" hidden aria-label="Video message from Gourav Mohanty">
            <video class="call-video" playsinline preload="metadata" src="./assets/gourav_message.mp4"></video>
            <div class="call-video-controls">
              <button class="video-play" type="button" aria-label="Pause video"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg></button>
              <span class="video-current">0:00</span>
              <input class="video-seek" type="range" min="0" max="1000" value="0" aria-label="Video position">
              <span class="video-duration">0:00</span>
            </div>
          </section>
          <div class="call-post-actions" hidden>
            <button class="call-replay" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14-5L3 9M3 4v5h5M4 13a8 8 0 0 0 14 5l3-3m0 5v-5h-5"/></svg><span>Replay</span></button>
            <button class="call-see-chat" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.25 11.25c0 4.15-3.7 7.5-8.25 7.5-.9 0-1.78-.13-2.6-.4L4 20l.9-4A7.1 7.1 0 0 1 3.75 11.25c0-4.15 3.7-7.5 8.25-7.5s8.25 3.35 8.25 7.5Z"/><circle cx="8.5" cy="11.25" r=".9"/><circle cx="12" cy="11.25" r=".9"/><circle cx="15.5" cy="11.25" r=".9"/></svg><span>See Conversation</span></button>
          </div>
          <section class="call-conversation" hidden aria-label="Conversation with Gourav Mohanty">
            <header class="conversation-header">
              <button class="conversation-back" type="button" aria-label="Back to replay options"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>
              <img src="./assets/gift20-gourav-mohanty.png" alt="">
              <div class="conversation-person"><strong>Gourav Mohanty <i aria-label="Verified">✓</i></strong><span>thekingbeyondthewall</span></div>
              <span class="conversation-phone" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3 4.5 4.5c-.8.5-.9 1.6-.6 2.5 1.5 5.6 6 10.1 11.6 11.6.9.3 2 0 2.5-.8l1.5-2.3-4-3-2 2c-2.1-1-3.7-2.6-4.7-4.7l2-2L7 3Z"/></svg></span>
              <span class="conversation-video" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 10 6-3v10l-6-3"/></svg></span>
            </header>
            <div class="conversation-scroll" aria-label="Chat messages">
              <img src="./assets/gm_ss1-scroll.jpeg?v=4" alt="Conversation messages, first section">
              <img src="./assets/gm_ss2.jpeg?v=4" alt="Conversation messages, second section">
              <img src="./assets/gm_ss3.jpeg?v=4" alt="Conversation messages, third section">
              <img src="./assets/gm_ss4.jpeg?v=4" alt="Conversation messages, final section">
            </div>
            <div class="conversation-composer" aria-hidden="true"><span class="composer-camera"><svg viewBox="0 0 24 24"><path d="M4 7h4l2-2h4l2 2h4v12H4z"/><circle cx="12" cy="13" r="3.2"/></svg></span><span class="composer-placeholder">Message...</span><svg viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM6 11v1a6 6 0 0 0 12 0v-1M12 18v4m-4 0h8"/></svg><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 5-5 3 3 3-4 5 6"/></svg><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 13s1.4 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v10m-5-5h10"/></svg></div>
          </section>
        </section>
      </div>
      <img class="s23-frame" src="./assets/gift20-phone-frame.svg" alt="">
    </div>`;

  const captureButton = document.createElement('button');
  captureButton.type = 'button';
  captureButton.className = 'reaction-start';
  captureButton.hidden = true;
  captureButton.setAttribute('aria-label', 'Capture your reaction');
  captureButton.dataset.tooltip = 'Capture your reaction';
  captureButton.innerHTML = '<svg class="reaction-orbit" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43"/><g class="reaction-camera-icon" transform="translate(50 50) scale(1.2)"><path d="M-14 -7h5l3-5h12l3 5h5v17h-28z"/><circle r="5"/></g></svg>';

  const synopsisScreen = element.querySelector('.goodreads-screen');
  const callScreen = element.querySelector('.android-call');
  const videoStage = element.querySelector('.call-video-stage');
  const video = element.querySelector('.call-video');
  const videoControls = element.querySelector('.call-video-controls');
  const videoPlay = element.querySelector('.video-play');
  const videoSeek = element.querySelector('.video-seek');
  const postActions = element.querySelector('.call-post-actions');
  const conversation = element.querySelector('.call-conversation');
  const conversationScroll = element.querySelector('.conversation-scroll');
  const ratingHits = element.querySelector('.goodreads-rating-hits');
  const starsFill = element.querySelector('.goodreads-stars-fill');
  const ringtone = new Audio('./assets/dd_ringtone.mp3');
  ringtone.loop = true;
  ringtone.preload = 'auto';
  let rating = 0;
  let hoverRating = 0;
  let incomingTimer = 0;

  const paintRating = value => { starsFill.style.clipPath = `inset(0 ${100 - value * 20}% 0 0)`; };
  for (let half = 1; half <= 10; half++) {
    const value = half / 2;
    const hit = document.createElement('button');
    hit.type = 'button';
    hit.className = `goodreads-rating-hit ${half % 2 ? 'is-left-half' : 'is-right-half'}`;
    hit.setAttribute('aria-label', `Rate ${value} out of 5 stars`);
    hit.addEventListener('pointerenter', () => { hoverRating = value; paintRating(hoverRating); });
    hit.addEventListener('focus', () => { hoverRating = value; paintRating(hoverRating); });
    hit.addEventListener('blur', () => { hoverRating = 0; paintRating(rating); });
    hit.addEventListener('click', () => {
      rating = value;
      hoverRating = 0;
      paintRating(rating);
      clearTimeout(incomingTimer);
      if (rating !== 5) return;
      // Prime playback during the rating gesture so the delayed incoming ringtone
      // remains eligible for autoplay in browsers that require user activation.
      ringtone.volume = 0;
      const priming = ringtone.play();
      priming?.then(() => { ringtone.pause(); ringtone.currentTime = 0; ringtone.volume = 1; }).catch(() => { ringtone.volume = 1; });
      incomingTimer = window.setTimeout(showIncomingCall, 1000);
    });
    ratingHits.append(hit);
  }
  ratingHits.addEventListener('pointerleave', () => { hoverRating = 0; paintRating(rating); });

  function stopRingtone() {
    ringtone.pause();
    ringtone.currentTime = 0;
    ringtone.volume = 1;
  }
  function showIncomingCall() {
    if (element.hidden || rating !== 5) return;
    synopsisScreen.hidden = true;
    callScreen.hidden = false;
    callScreen.classList.remove('is-connected');
    callScreen.classList.remove('is-conversation');
    callScreen.querySelector('.call-kicker').textContent = 'Incoming call';
    callScreen.querySelector('.call-actions').hidden = false;
    callScreen.querySelector('.call-end').hidden = true;
    callScreen.querySelector('.call-contact').hidden = false;
    videoStage.hidden = true;
    postActions.hidden = true;
    conversation.hidden = true;
    video.pause();
    video.currentTime = 0;
    const playback = ringtone.play();
    playback?.catch(() => {});
  }
  function returnToBook(retry = false) {
    stopRingtone();
    video.pause();
    video.currentTime = 0;
    videoStage.hidden = true;
    postActions.hidden = true;
    conversation.hidden = true;
    callScreen.classList.remove('is-conversation');
    callScreen.hidden = true;
    synopsisScreen.hidden = false;
    clearTimeout(incomingTimer);
    if (retry && rating === 5 && !element.hidden) {
      incomingTimer = window.setTimeout(showIncomingCall, 1000);
    }
  }
  function answerCall() {
    stopRingtone();
    callScreen.classList.add('is-connected');
    callScreen.classList.remove('is-conversation');
    callScreen.querySelector('.call-kicker').textContent = '';
    callScreen.querySelector('.call-actions').hidden = true;
    callScreen.querySelector('.call-end').hidden = true;
    callScreen.querySelector('.call-contact').hidden = true;
    postActions.hidden = true;
    conversation.hidden = true;
    videoStage.hidden = false;
    video.currentTime = 0;
    updatePlayButton();
    const playback = video.play();
    playback?.catch(updatePlayButton);
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const value = Math.max(0, Math.floor(seconds));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  }
  function updatePlayButton() {
    const paused = video.paused;
    videoPlay.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    videoPlay.querySelector('svg').innerHTML = paused
      ? '<path d="M8 5v14l11-7z"/>'
      : '<path d="M7 5h4v14H7zM15 5h4v14h-4z"/>';
  }
  function updateVideoControls() {
    const duration = video.duration;
    if (Number.isFinite(duration) && duration > 0) {
      videoSeek.value = String(Math.round((video.currentTime / duration) * 1000));
      element.querySelector('.video-duration').textContent = formatTime(duration);
      element.querySelector('.video-current').textContent = formatTime(video.currentTime);
      if (video.currentTime >= duration - 1) finishVideo();
    }
    videoPlay.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  }
  function finishVideo() {
    if (videoStage.hidden) return;
    video.pause();
    videoStage.hidden = true;
    postActions.hidden = false;
    conversation.hidden = true;
  }
  video.addEventListener('timeupdate', updateVideoControls);
  video.addEventListener('durationchange', updateVideoControls);
  video.addEventListener('seeked', updateVideoControls);
  video.addEventListener('ended', finishVideo);
  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);
  video.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  videoPlay.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  videoSeek.addEventListener('input', () => {
    if (Number.isFinite(video.duration)) video.currentTime = (Number(videoSeek.value) / 1000) * video.duration;
  });
  postActions.querySelector('.call-replay').addEventListener('click', answerCall);
  postActions.querySelector('.call-see-chat').addEventListener('click', () => {
    video.pause();
    postActions.hidden = true;
    conversation.hidden = false;
      callScreen.classList.add('is-conversation');
    conversationScroll.scrollTop = 0;
  });
  conversation.querySelector('.conversation-back').addEventListener('click', () => {
    conversation.hidden = true;
    callScreen.classList.remove('is-conversation');
    postActions.hidden = false;
  });
  let dragStartY = 0;
  let dragStartScroll = 0;
  let draggingChat = false;
  conversationScroll.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    draggingChat = true;
    dragStartY = event.clientY;
    dragStartScroll = conversationScroll.scrollTop;
    conversationScroll.classList.add('is-dragging');
    conversationScroll.setPointerCapture(event.pointerId);
  });
  conversationScroll.addEventListener('pointermove', event => {
    if (draggingChat) conversationScroll.scrollTop = dragStartScroll - (event.clientY - dragStartY);
  });
  const stopChatDrag = () => {
    draggingChat = false;
    conversationScroll.classList.remove('is-dragging');
  };
  conversationScroll.addEventListener('pointerup', stopChatDrag);
  conversationScroll.addEventListener('pointercancel', stopChatDrag);

  callScreen.querySelector('.call-answer').addEventListener('click', answerCall);
  callScreen.querySelector('.call-decline').addEventListener('click', () => returnToBook(true));
  callScreen.querySelector('.call-end').addEventListener('click', returnToBook);

  return {
    element, captureButton,
    show() {
      clearTimeout(incomingTimer);
      stopRingtone();
      video.pause();
      video.currentTime = 0;
      videoStage.hidden = true;
      postActions.hidden = true;
      conversation.hidden = true;
      callScreen.classList.remove('is-conversation');
      element.hidden = false;
      captureButton.hidden = false;
      synopsisScreen.hidden = false;
      callScreen.hidden = true;
      callScreen.classList.remove('is-connected');
      callScreen.querySelector('.call-actions').hidden = false;
      callScreen.querySelector('.call-end').hidden = true;
      callScreen.querySelector('.call-contact').hidden = false;
      rating = 0;
      hoverRating = 0;
      paintRating(0);
    },
    hide() {
      clearTimeout(incomingTimer);
      stopRingtone();
      video.pause();
      video.currentTime = 0;
      element.hidden = true;
      captureButton.hidden = true;
    },
    stop() {
      clearTimeout(incomingTimer);
      stopRingtone();
      video.pause();
    }
  };
}
