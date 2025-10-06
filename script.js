
let currentUser = null; 
let notes = []; 
let currentNoteId = null; 
let sidebarOpen = true; 


document.addEventListener('DOMContentLoaded', function() {

    loadFromLocalStorage();
    
  
    showScreen('welcomeScreen');
    
    setupSearch();
});


function loadFromLocalStorage() {
 
    const savedUser = localStorage.getItem('warmNooksUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    

    const savedNotes = localStorage.getItem('warmNooksNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
}


function saveNotes() {
    localStorage.setItem('warmNooksNotes', JSON.stringify(notes));
}


function saveUser() {
    if (currentUser) {
        localStorage.setItem('warmNooksUser', JSON.stringify(currentUser));
    }
}


function showScreen(screenId) {

    const screens = document.querySelectorAll('.screen');
    

    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
    

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
}


function showWelcome() {
    showScreen('welcomeScreen');
}


function showLogin() {
    showScreen('loginScreen');
}


function showCreateAccount() {
    showScreen('createAccountScreen');
}


function showCreateAccountFromLogin() {
    showScreen('createAccountScreen');
}


function showLoginFromCreateAccount() {
    showScreen('loginScreen');
}



function login(event) {
    event.preventDefault(); 
    

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
   
    currentUser = {
        name: email.split('@')[0],
        email: email
    };

    saveUser();
    showMainApp();
}


function createAccount(event) {
    event.preventDefault(); 
    
 
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
   
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    
    currentUser = {
        name: name,
        email: email
    };
    

    saveUser();
    showMainApp();
}


function showMainApp() {

    showScreen('mainApp');
    

    const usernameElement = document.querySelector('.username');
    if (usernameElement && currentUser) {
        usernameElement.textContent = currentUser.name;
    }
    

    navigateTo('notes');
}


function logout() {
   
    currentUser = null;
    localStorage.removeItem('warmNooksUser');
    
  
    showScreen('welcomeScreen');
    
   
    sidebarOpen = true;
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    if (sidebar) sidebar.classList.remove('sidebar-closed');
    if (mainContent) mainContent.classList.remove('full-width');
    if (toggleBtn) {
        toggleBtn.classList.remove('sidebar-closed');
        toggleBtn.textContent = '◀';
    }
    

    const loginForm = document.querySelector('#loginScreen form');
    const signupForm = document.querySelector('#createAccountScreen form');
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();
}


function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    if (sidebarOpen) {
        sidebar.classList.remove('sidebar-closed');
        mainContent.classList.remove('full-width');
        toggleBtn.classList.remove('sidebar-closed');
        toggleBtn.textContent = '◀';
    } else {
        sidebar.classList.add('sidebar-closed');
        mainContent.classList.add('full-width');
        toggleBtn.classList.add('sidebar-closed');
        toggleBtn.textContent = '▶';
    }
}


function navigateTo(sectionId) {
    
    const sectionMap = {
        'notes': 'notesSection',
        'new': 'newSection',
        'favorites': 'favoritesSection',
        'archive': 'archiveSection',
        'about': 'aboutSection',
        'settings': 'settingsSection'
    };
    
    const actualSectionId = sectionMap[sectionId] || sectionId;
    

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    

    const targetSection = document.getElementById(actualSectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    
    const activeButton = document.querySelector(`[onclick="navigateTo('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    
    if (actualSectionId === 'notesSection') {
        renderNotes();
    } else if (actualSectionId === 'newSection') {
        clearNoteEditor();
    } else if (actualSectionId === 'favoritesSection') {
        renderFavorites();
    } else if (actualSectionId === 'archiveSection') {
        renderArchive();
    }
}

