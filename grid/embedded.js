// Move the rules control out of the sidebar hidden in embedded mode.
(() => {
    'use strict';
    if (!new URLSearchParams(location.search).has('embedded')) return;
    document.documentElement.classList.add('embedded');
    const tools = document.querySelector('.top-right');
    const help = document.getElementById('help-button');
    help.className = 'button small'; help.textContent = '玩法规则'; tools.appendChild(help);
})();
