// Data Storage
let currentUser = null;
let currentTaskId = null;
let currentSubmissionId = null;
let currentMode = 'test'; // 'test' or 'practice'

// Mode Selection
function selectMode(mode) {
    currentMode = mode;
    localStorage.setItem('currentMode', mode);
    
    // Update UI
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`.mode-${mode}`).classList.add('selected');
    
    // Show login buttons
    document.getElementById('login-buttons-container').style.display = 'flex';
    
    // Show/hide practice mode elements
    const practiceElements = document.querySelectorAll('.practice-mode-only');
    practiceElements.forEach(el => {
        el.style.display = mode === 'practice' ? 'block' : 'none';
    });
}

// Initialize mode from localStorage
function initializeMode() {
    const savedMode = localStorage.getItem('currentMode');
    if (savedMode) {
        currentMode = savedMode;
        selectMode(savedMode);
    }
}

// Scoring Criteria Management
function addCriterion() {
    const container = document.getElementById('scoring-criteria-container');
    const newCriterion = document.createElement('div');
    newCriterion.className = 'scoring-criterion';
    newCriterion.innerHTML = `
        <input type="text" class="criterion-name" placeholder="评分项 / Criterion Name" value="">
        <input type="number" class="criterion-score" placeholder="分值 / Score" value="5" min="1" max="20">
        <button type="button" class="btn btn-small btn-danger" onclick="removeCriterion(this)">删除</button>
    `;
    container.appendChild(newCriterion);
    updateCriteriaTotal();
}

function removeCriterion(button) {
    button.parentElement.remove();
    updateCriteriaTotal();
}

function updateCriteriaTotal() {
    const criteria = document.querySelectorAll('.scoring-criterion');
    let total = 0;
    criteria.forEach(el => {
        const score = parseFloat(el.querySelector('.criterion-score').value) || 0;
        total += score;
    });
    
    const totalDisplay = document.getElementById('criteria-total');
    totalDisplay.textContent = `总分 / Total: ${total}`;
    totalDisplay.className = Math.abs(total - 20) < 0.01 ? '' : 'error';
}

// Photo Upload Handler
let uploadedPhotoData = null;

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件 / Please upload an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedPhotoData = e.target.result;
        const preview = document.getElementById('photo-preview');
        preview.innerHTML = `<img src="${uploadedPhotoData}" alt="Handwriting Photo">`;
    };
    reader.readAsDataURL(file);
}

// Initialize with sample data
function initializeData() {
    if (!localStorage.getItem('tasks')) {
        const sampleTasks = [
            {
                id: 'task-1',
                title: '绿色北京社团活动建议',
                prompt: '假设你是红星中学高三学生李华。你的英国好友Jim正在策划一次以"绿色北京"为主题的社团活动，他发来邮件询问你的建议。请你用英文给他回复，内容包括：\n1．活动形式；\n2．活动内容。',
                wordMin: 100,
                wordMax: 150,
                createdAt: new Date().toISOString(),
                analysis: null
            }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }

    if (!localStorage.getItem('examples')) {
        const sampleExamples = [
            {
                id: 'example-1',
                title: '优秀范文 (17-19分)',
                scoreBand: '17-19',
                content: `Dear Jim,
I'm delighted to hear about your "Green Beijing" initiative and would love to offer some carefully considered suggestions.
As for the form, a "Learning Trip" would be an ideal choice, combining outdoor experience with environmental learning. Immersed in nature, members can better appreciate green living and feel inspired to protect the environment. 
As for the content, a visit to the Beijing Olympic Forest Park would be highly rewarding. As the most successful representative of "Green Administration" in Beijing, the park offers vivid examples of sustainable development. Guided around it, you could learn how it purifies polluted water, reduces human impact, and protects wildlife. To make the experience more engaging, you might record short videos or interviews, sharing what you have learned with others and encouraging more people to embrace a greener lifestyle.
Hope the above suggestions will contribute to a meaningful and successful event.`,
                commentary: '这篇作文语言丰富，使用了高级词汇和复杂句式（如分词短语、条件句），内容具体且有深度，结构清晰，逻辑流畅。',
                createdAt: new Date().toISOString()
            },
            {
                id: 'example-2',
                title: '良好范文 (13-15分)',
                scoreBand: '13-15',
                content: `Dear Jim,
I'm glad to hear about your club activity. I think it is a good idea and I want to give you some advice.
For the activity, I think we can do many things. We can walk around the streets and parks in Beijing, and we can also visit the Olympic Forest Park because it is a good example of green development. There we can see how the park saves water and protects plants. We can also pick up litter along the way and put it into different bins, which is good for the environment. Besides, taking photos and making a short video is also a good idea, and we can share them with other students. Oh, and we can also learn about clean energy there. The activity can be in the form of a "Green Walk," I think. It is easy to organize and everyone can take part in it.
I hope these ideas are helpful. I'm sure your activity will be a great success.
Yours,
Li Hua`,
                commentary: '这篇作文覆盖了所有要点，语言基本正确，但句式较为简单，组织结构有待改进（活动形式放在最后提及）。',
                createdAt: new Date().toISOString()
            },
            {
                id: 'example-3',
                title: '及格范文 (9-11分)',
                scoreBand: '9-11',
                content: `I'm glad to hear about your club activity. I want to give you some advice.
I think "Green Beijing" is a very good topic. Beijing is a beautiful city with a long history. There are many places to visit, such as the Great Wall, the Forbidden City, and the Summer Palace. I went to the Great Wall last year with my parents. We took many photos and ate Beijing duck. It was very delicious. You should go there too if you have time.
For your activity, I think we can do many things. We can visit the Olympic Forest Park because it is a good example of green development. We can also pick up litter. Oh, and taking photos is also good. And we can make a video. By the way, the activity can be a "Green Walk." It is easy to organize. And everyone can take part in it.
I hope these ideas are helpful. I'm sure your activity will be a great success.
Yours,
Li Hua`,
                commentary: '这篇作文包含了一些与任务无关的内容（如长城游览、北京烤鸭），偏离主题，虽然语言基本正确但内容相关性较差。',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('examples', JSON.stringify(sampleExamples));
    }

    if (!localStorage.getItem('submissions')) {
        localStorage.setItem('submissions', JSON.stringify([]));
    }

    if (!localStorage.getItem('materials')) {
        const sampleMaterials = [
            {
                id: 'mat-1',
                theme: '环保/Environmental Protection',
                title: 'Olympic Forest Park',
                content: 'Beijing Olympic Forest Park - the most successful representative of "Green Administration" in Beijing, offering vivid examples of sustainable development.',
                keywords: ['sustainable development', 'green administration', 'wildlife protection', 'water purification'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-2',
                theme: '环保/Environmental Protection',
                title: 'Green Living Expressions',
                content: 'Immersed in nature, members can better appreciate green living and feel inspired to protect the environment.',
                keywords: ['green living', 'environmental awareness', 'sustainability'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-3',
                theme: '文化交流/Cultural Exchange',
                title: 'Traditional Culture Activities',
                content: 'Organize a Chinese culture festival where international students can experience calligraphy, paper-cutting, and traditional music.',
                keywords: ['cultural heritage', 'traditional arts', 'cross-cultural communication'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-4',
                theme: '志愿服务/Volunteer Service',
                title: 'Community Service Ideas',
                content: 'Visit local nursing homes to teach seniors how to use smartphones, bridging the digital divide.',
                keywords: ['community service', 'digital literacy', 'intergenerational connection'],
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('materials', JSON.stringify(sampleMaterials));
    }
}

// Login/Logout
function login(role) {
    if (role === 'student') {
        const nameInput = document.getElementById('student-name-input');
        const studentName = nameInput ? nameInput.value.trim() : '';
        if (!studentName) {
            alert('请输入你的名字 / Please enter your name');
            return;
        }
        currentUser = { role: role, name: studentName };
    } else {
        currentUser = { role: role, name: '王老师' };
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showScreen(role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    
    // Add mode indicator to navbar
    const navbar = document.querySelector(`#${role}-dashboard .navbar`);
    const existingIndicator = navbar.querySelector('.practice-mode-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    if (currentMode === 'practice') {
        const indicator = document.createElement('div');
        indicator.className = 'practice-mode-indicator';
        indicator.textContent = '练习模式 / Practice Mode';
        navbar.insertBefore(indicator, navbar.firstChild);
    }
    
    if (role === 'teacher') {
        loadTeacherDashboard();
    } else {
        loadStudentDashboard();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showScreen('login-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Tab Navigation
function showTeacherTab(tabName) {
    document.querySelectorAll('#teacher-dashboard .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('#teacher-dashboard .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function showStudentTab(tabName) {
    document.querySelectorAll('#student-dashboard .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('#student-dashboard .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Teacher Dashboard
function loadTeacherDashboard() {
    renderTasksList();
    renderSubmissionsList();
    renderExamplesList();
    renderMaterialsList();
}

function renderTasksList() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const container = document.getElementById('tasks-list');
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"></div><h3>暂无任务</h3><p>创建第一个写作任务开始使用</p></div>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="card">
            <div class="card-header">
                <div>
                    <div class="card-title">${escapeHtml(task.title)}</div>
                    <div class="card-meta">
                        <span>字数: ${task.wordMin}-${task.wordMax}词</span>
                        ${task.analysis ? '<span class="badge badge-excellent">已分析</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="card-content">${escapeHtml(task.prompt).substring(0, 100)}...</div>
            <div class="card-actions">
                ${task.analysis ? `<button onclick="viewTaskAnalysis('${task.id}')" class="btn btn-secondary btn-small">查看分析</button>` : ''}
                <button onclick="deleteTask('${task.id}')" class="btn btn-danger btn-small">删除</button>
            </div>
        </div>
    `).join('');
}

function renderSubmissionsList() {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const container = document.getElementById('submissions-list');

    if (submissions.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📄</div><h3>暂无提交</h3><p>学生提交作文后将显示在这里</p></div>';
        return;
    }

    const attemptCounts = {};
    submissions.filter(s => s.status !== 'draft').forEach(sub => {
        const key = sub.taskId + '_' + sub.studentName;
        attemptCounts[key] = (attemptCounts[key] || 0) + 1;
    });

    const attemptTracker = {};
    submissions.forEach(sub => {
        const key = sub.taskId + '_' + sub.studentName;
        if (!attemptTracker[key]) attemptTracker[key] = 0;
        attemptTracker[key]++;
        sub._attemptNumber = attemptTracker[key];
        sub._totalAttempts = attemptCounts[key] || 1;
    });

    container.innerHTML = submissions.map(sub => {
        const task = getTaskById(sub.taskId);
        const statusClass = sub.status === 'published' ? 'status-published' :
                          sub.status === 'ai-scored' ? 'status-reviewed' :
                          sub.status === 'reviewed' ? 'status-reviewed' : 'status-pending';
        const statusText = sub.status === 'published' ? '教师已发布' :
                          sub.status === 'ai-scored' ? 'AI已评分' :
                          sub.status === 'reviewed' ? '已评阅' : '待评阅';

        return `
            <div class="submission-card">
                <div class="submission-info">
                    <h3>${task ? escapeHtml(task.title) : '未知任务'} ${sub._totalAttempts > 1 ? `<span style="color: var(--text-secondary); font-size: 0.875rem;">(第 ${sub._attemptNumber}/${sub._totalAttempts} 次)</span>` : ''}</h3>
                    <div class="submission-meta">
                        <span>学生: ${escapeHtml(sub.studentName)}</span>
                        <span>提交时间: ${new Date(sub.submittedAt).toLocaleString('zh-CN')}</span>
                        <span>字数: ${sub.wordCount}</span>
                    </div>
                    <div class="submission-preview">${escapeHtml(sub.content.substring(0, 100))}...</div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="submission-score">
                    ${sub.scores ? `
                        <div class="score-badge">${sub.scores.total}</div>
                        <div class="score-label-small">/ 20分</div>
                    ` : `
                        <div class="score-badge">--</div>
                        <div class="score-label-small">待评分</div>
                    `}
                    <button onclick="reviewSubmission('${sub.id}')" class="btn btn-primary btn-small" style="margin-top: 0.5rem;">
                        ${sub.scores ? '查看/调整' : '评阅'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderExamplesList() {
    const examples = JSON.parse(localStorage.getItem('examples') || '[]');
    const container = document.getElementById('examples-list');
    
    if (examples.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📚</div><h3>暂无范文</h3><p>添加范文帮助学生学</p></div>';
        return;
    }

    container.innerHTML = examples.map(ex => {
        const badgeClass = ex.scoreBand === '17-19' ? 'badge-excellent' : 
                          ex.scoreBand === '13-15' ? 'badge-good' : 'badge-pass';
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${escapeHtml(ex.title)}</div>
                    <span class="badge ${badgeClass}">${ex.scoreBand}分</span>
                </div>
                <div class="card-content">${escapeHtml(ex.content.substring(0, 150))}...</div>
                <div class="card-actions">
                    <button onclick="viewExample('${ex.id}')" class="btn btn-secondary btn-small">查看</button>
                    <button onclick="deleteExample('${ex.id}')" class="btn btn-danger btn-small">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

// Task Management
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const task = {
        id: 'task-' + Date.now(),
        title: document.getElementById('task-title').value,
        prompt: document.getElementById('task-prompt').value,
        wordMin: parseInt(document.getElementById('word-min').value),
        wordMax: parseInt(document.getElementById('word-max').value),
        createdAt: new Date().toISOString(),
        analysis: analyzeTask(document.getElementById('task-prompt').value),
        mode: currentMode
    };
    
    // Add custom scoring criteria for practice mode
    if (currentMode === 'practice') {
        const criteria = [];
        const criterionElements = document.querySelectorAll('.scoring-criterion');
        let totalScore = 0;
        
        criterionElements.forEach(el => {
            const name = el.querySelector('.criterion-name').value.trim();
            const score = parseFloat(el.querySelector('.criterion-score').value);
            if (name && score > 0) {
                criteria.push({ name, score });
                totalScore += score;
            }
        });
        
        if (Math.abs(totalScore - 20) > 0.01) {
            alert(`评分标准总分必须为20分，当前为${totalScore}分 / Total score must be 20, currently ${totalScore}`);
            return;
        }
        
        task.scoringCriteria = criteria;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    this.reset();
    document.getElementById('word-min').value = '100';
    document.getElementById('word-max').value = '150';
    
    renderTasksList();
    alert('任务创建成功！已自动生成任务分析。');
});

// Task Analysis - Brainstorm and Mindmap
function analyzeTask(prompt) {
    const mainPoints = extractMainPoints(prompt);
    const theme = detectTheme(prompt);
    const relatedMaterials = findRelatedMaterials(theme);
    
    // Brainstorm appropriate content based on theme
    const brainstorm = generateBrainstorm(theme, mainPoints);
    
    // Create mindmap structure
    const mindmap = {
        centralTopic: mainPoints.join(' + '),
        branches: brainstorm.map(item => ({
            topic: item.category,
            ideas: item.suggestions,
            usefulExpressions: item.expressions
        }))
    };
    
    return {
        mainPoints: mainPoints,
        theme: theme,
        brainstorm: brainstorm,
        mindmap: mindmap,
        relatedMaterials: relatedMaterials,
        scoringGuidance: generateScoringGuidance(theme)
    };
}

function detectTheme(prompt) {
    const themes = {
        '环保': ['green', 'environment', 'eco', 'sustainable', 'pollution', 'protect', '环保', '绿色', '环境', '生态', '污染'],
        '文化交流': ['culture', 'traditional', 'festival', 'heritage', 'custom', '文化', '传统', '节日', '遗产'],
        '志愿服务': ['volunteer', 'community', 'help', 'service', 'charity', '志愿', '社区', '服务', '慈善'],
        '校园生活': ['school', 'campus', 'study', 'class', 'exam', '学校', '校园', '学习', '课堂', '考试'],
        '科技': ['technology', 'digital', 'internet', 'AI', 'innovation', '科技', '数字', '互联网', '创新'],
        '健康': ['health', 'exercise', 'sport', 'fitness', 'diet', '健康', '运动', '锻炼', '饮食']
    };

    const promptLower = prompt.toLowerCase();
    for (let [theme, keywords] of Object.entries(themes)) {
        if (keywords.some(k => promptLower.includes(k))) {
            return theme;
        }
    }
    return '通用';
}

function generateBrainstorm(theme, mainPoints) {
    const brainstormDB = {
        '环保': [
            {
                category: '活动形式 Activity Forms',
                suggestions: ['Learning Trip', 'Green Walk', 'Eco-workshop', 'Tree Planting', 'Recycling Campaign'],
                expressions: ['immersed in nature', 'environmental awareness', 'sustainable development', 'carbon footprint']
            },
            {
                category: '活动内容 Activity Content',
                suggestions: ['Visit Olympic Forest Park', 'Learn about water purification', 'Wildlife protection', 'Clean energy exhibition'],
                expressions: ['green administration', 'reduce human impact', 'protect wildlife', 'embrace greener lifestyle']
            },
            {
                category: '预期效果 Expected Outcomes',
                suggestions: ['Raise environmental awareness', 'Inspire action', 'Share knowledge', 'Build community'],
                expressions: ['meaningful and successful', 'contribute to', 'make a difference', 'positive impact']
            }
        ],
        '文化交流': [
            {
                category: '活动形式 Activity Forms',
                suggestions: ['Cultural Festival', 'Exchange Program', 'Workshop', 'Performance', 'Exhibition'],
                expressions: ['cultural heritage', 'cross-cultural communication', 'traditional arts', 'mutual understanding']
            },
            {
                category: '活动内容 Activity Content',
                suggestions: ['Calligraphy experience', 'Paper-cutting', 'Traditional music', 'Tea ceremony', 'Martial arts'],
                expressions: ['time-honored tradition', 'artistic expression', 'cultural identity', 'preserve heritage']
            }
        ],
        '志愿服务': [
            {
                category: '活动形式 Activity Forms',
                suggestions: ['Community Visit', 'Teaching Program', 'Fundraising', 'Awareness Campaign'],
                expressions: ['give back to community', 'make a contribution', 'volunteer spirit', 'social responsibility']
            },
            {
                category: '活动内容 Activity Content',
                suggestions: ['Teach digital skills to seniors', 'Clean public spaces', 'Help disabled children', 'Organize charity sale'],
                expressions: ['bridge the gap', 'bring warmth', 'positive energy', 'collective effort']
            }
        ]
    };
    
    return brainstormDB[theme] || brainstormDB['环保'];
}

function findRelatedMaterials(theme) {
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    return materials.filter(m => m.theme.includes(theme) || theme === '通用');
}

function generateScoringGuidance(theme) {
    return {
        highScoreCriteria: '18+分要求：内容极具深度和创意，语言地道且句式多样，结构完美',
        themeSpecificNotes: `${theme}主题应关注专业词汇使用和话题相关性`,
        commonMistakes: ['偏离主题', '内容空洞', '句式单一', '逻辑不清']
    };
}

function deleteTask(taskId) {
    if (!confirm('确定要删除这个任务吗？')) return;
    
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasksList();
}

// Student Dashboard
function loadStudentDashboard() {
    renderAssignmentsList();
    renderHistoryList();
    renderExamplesListStudent();
}

function renderAssignmentsList() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const container = document.getElementById('assignments-list');

    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><h3>暂无可用任务</h3><p>教师尚未创建写作任务</p></div>';
        return;
    }

    container.innerHTML = tasks.map(task => {
        const taskSubmissions = submissions.filter(s =>
            s.taskId === task.id && s.studentName === currentUser.name && s.status !== 'draft'
        );
        const attemptCount = taskSubmissions.length;
        const latestSubmission = taskSubmissions.sort((a, b) =>
            new Date(b.submittedAt) - new Date(a.submittedAt)
        )[0];
        const hasResults = latestSubmission && (latestSubmission.status === 'published' || latestSubmission.status === 'ai-scored');

        let actionButtons = `<button onclick="openWritingEditor('${task.id}')" class="btn btn-primary btn-small">${attemptCount > 0 ? '重新写作 / Resubmit' : '开始写作 / Start Writing'}</button>`;
        if (hasResults) {
            actionButtons = `<button onclick="viewSubmission('${latestSubmission.id}')" class="btn btn-secondary btn-small">查看结果 / View Results</button>` + actionButtons;
        }

        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${escapeHtml(task.title)}</div>
                    ${attemptCount > 0 ? `<span class="badge badge-good">已提交 ${attemptCount} 次</span>` : ''}
                </div>
                <div class="card-meta">
                    <span>字数要求: ${task.wordMin}-${task.wordMax}词</span>
                </div>
                <div class="card-content">${escapeHtml(task.prompt)}</div>
                <div class="card-actions">
                    ${actionButtons}
                </div>
            </div>
        `;
    }).join('');
}

function renderHistoryList() {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]')
        .filter(s => s.studentName === currentUser.name)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    const container = document.getElementById('history-list');

    if (submissions.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📄</div><h3>暂无提交记录</h3><p>开始写作任务吧</p></div>';
        return;
    }

    const attemptCounts = {};
    submissions.forEach(sub => {
        const key = sub.taskId;
        attemptCounts[key] = (attemptCounts[key] || 0) + 1;
    });

    const attemptTracker = {};
    submissions.forEach(sub => {
        if (!attemptTracker[sub.taskId]) attemptTracker[sub.taskId] = 0;
        attemptTracker[sub.taskId]++;
        sub._attemptNumber = attemptTracker[sub.taskId];
        sub._totalAttempts = attemptCounts[sub.taskId];
    });

    container.innerHTML = submissions.map(sub => {
        const task = getTaskById(sub.taskId);
        const statusClass = sub.status === 'published' ? 'status-published' :
                          sub.status === 'ai-scored' ? 'status-reviewed' :
                          sub.status === 'reviewed' ? 'status-reviewed' : 'status-pending';
        const statusText = sub.status === 'published' ? '教师已评阅' :
                          sub.status === 'ai-scored' ? 'AI已评分' :
                          sub.status === 'reviewed' ? '已评阅' : '待评阅';

        return `
            <div class="submission-card">
                <div class="submission-info">
                    <h3>${task ? escapeHtml(task.title) : '未知任务'} <span style="color: var(--text-secondary); font-size: 0.875rem;">(第 ${sub._attemptNumber}/${sub._totalAttempts} 次)</span></h3>
                    <div class="submission-meta">
                        <span>提交时间: ${new Date(sub.submittedAt).toLocaleString('zh-CN')}</span>
                        <span>字数: ${sub.wordCount}</span>
                    </div>
                    <div class="submission-preview">${escapeHtml(sub.content.substring(0, 100))}...</div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="submission-score">
                    ${sub.scores ? `
                        <div class="score-badge">${sub.scores.total}</div>
                        <div class="score-label-small">/ 20分</div>
                    ` : `
                        <div class="score-badge">--</div>
                        <div class="score-label-small">待评分</div>
                    `}
                    ${sub.scores ?
                        `<button onclick="viewSubmission('${sub.id}')" class="btn btn-primary btn-small" style="margin-top: 0.5rem;">查看详情</button>` : ''
                    }
                </div>
            </div>
        `;
    }).join('');
}

function renderExamplesListStudent() {
    const examples = JSON.parse(localStorage.getItem('examples') || '[]');
    const container = document.getElementById('examples-list-student');
    
    if (examples.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📚</div><h3>暂无范文</h3><p>范文将帮助学生学习写作技巧</p></div>';
        return;
    }

    container.innerHTML = examples.map(ex => {
        const badgeClass = ex.scoreBand === '17-19' ? 'badge-excellent' : 
                          ex.scoreBand === '13-15' ? 'badge-good' : 'badge-pass';
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${escapeHtml(ex.title)}</div>
                    <span class="badge ${badgeClass}">${ex.scoreBand}分</span>
                </div>
                <div class="card-content">${escapeHtml(ex.content.substring(0, 150))}...</div>
                <div class="card-actions">
                    <button onclick="viewExample('${ex.id}')" class="btn btn-secondary btn-small">查看范文</button>
                </div>
            </div>
        `;
    }).join('');
}

// Writing Editor
function openWritingEditor(taskId) {
    currentTaskId = taskId;
    const task = getTaskById(taskId);
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const previousAttempts = submissions.filter(s =>
        s.taskId === taskId && s.studentName === currentUser.name && s.status !== 'draft'
    );

    let attemptInfo = '';
    if (previousAttempts.length > 0) {
        const latestAttempt = previousAttempts.sort((a, b) =>
            new Date(b.submittedAt) - new Date(a.submittedAt)
        )[0];
        attemptInfo = `<p style="margin-top: 0.5rem; padding: 0.75rem; background: #fef3c7; border-radius: 0.5rem; border-left: 3px solid var(--warning-color);">
            <strong>第 ${previousAttempts.length + 1} 次提交</strong> | 上次得分: ${latestAttempt.scores ? latestAttempt.scores.total + '/20' : '待评阅'}
            ${latestAttempt.scores ? `<br><span style="font-size: 0.875rem;">查看 <a href="#" onclick="viewSubmission('${latestAttempt.id}'); return false;" style="color: var(--primary-color);">上次评阅详情</a></span>` : ''}
        </p>`;
    }

    document.getElementById('writing-task-info').innerHTML = `
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(task.prompt)}</p>
        <p style="margin-top: 0.5rem;"><strong>字数要求:</strong> ${task.wordMin}-${task.wordMax}词</p>
        ${attemptInfo}
    `;

    document.getElementById('writing-content').value = '';
    updateWordCount();
    showModal('writing-modal');
}

document.getElementById('writing-content').addEventListener('input', updateWordCount);

function updateWordCount() {
    const content = document.getElementById('writing-content').value;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    document.getElementById('word-count').textContent = wordCount;
}

function saveDraft() {
    const content = document.getElementById('writing-content').value.trim();
    if (!content) {
        alert('请输入作文内容');
        return;
    }

    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const existingDraft = submissions.find(s => 
        s.taskId === currentTaskId && 
        s.studentName === currentUser.name && 
        s.status === 'draft'
    );

    const submission = {
        id: existingDraft ? existingDraft.id : 'sub-' + Date.now(),
        taskId: currentTaskId,
        studentName: currentUser.name,
        content: content,
        wordCount: content.split(/\s+/).length,
        status: 'draft',
        submittedAt: new Date().toISOString()
    };

    if (existingDraft) {
        const index = submissions.findIndex(s => s.id === existingDraft.id);
        submissions[index] = submission;
    } else {
        submissions.push(submission);
    }

    localStorage.setItem('submissions', JSON.stringify(submissions));
    alert('草稿已保存！');
}

function submitWriting() {
    const content = document.getElementById('writing-content').value.trim();
    if (!content) {
        alert('请输入作文内容');
        return;
    }

    const task = getTaskById(currentTaskId);
    const wordCount = content.split(/\s+/).length;

    // Word count is flexible: 100-220 words is acceptable
    if (wordCount < 100 || wordCount > 220) {
        if (!confirm(`字数(${wordCount})不在建议范围(100-220)内，确定要提交吗？`)) {
            return;
        }
    }

    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const existingDraft = submissions.find(s =>
        s.taskId === currentTaskId &&
        s.studentName === currentUser.name &&
        s.status === 'draft'
    );

    if (existingDraft) {
        submissions.splice(submissions.indexOf(existingDraft), 1);
    }

    const submission = {
        id: 'sub-' + Date.now(),
        taskId: currentTaskId,
        studentName: currentUser.name,
        content: content,
        wordCount: wordCount,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        mode: currentMode
    };
    
    // Add photo data if uploaded (Practice Mode)
    if (uploadedPhotoData) {
        submission.handwritingPhoto = uploadedPhotoData;
        uploadedPhotoData = null; // Reset after saving
    }

    // Auto-score the submission
    submission.scores = scoreSubmission(submission);
    submission.grammarCorrections = submission.scores.grammarErrors;
    submission.status = 'ai-scored';

    submissions.push(submission);
    localStorage.setItem('submissions', JSON.stringify(submissions));

    closeModal('writing-modal');

    // Show AI results to student immediately
    showAIResults(submission);
}

function showAIResults(submission) {
    const task = getTaskById(submission.taskId);

    let grammarHTML = '';
    if (submission.grammarCorrections && submission.grammarCorrections.length > 0) {
        grammarHTML = `
            <div class="feedback-section" style="margin-top: 1.5rem;">
                <h4>✏️ 语法修正 / Grammar Corrections</h4>
                <div class="grammar-corrections">
                    ${submission.grammarCorrections.map(c => `
                        <div class="grammar-item">
                            <span class="grammar-error">${escapeHtml(c.original)}</span>
                            <span class="grammar-arrow">→</span>
                            <span class="grammar-correct">${escapeHtml(c.correction)}</span>
                            <span class="grammar-explain">${escapeHtml(c.explanation)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Example comparison HTML
    let exampleComparisonHTML = '';
    if (submission.scores.feedback.exampleComparison) {
        const comp = submission.scores.feedback.exampleComparison;
        exampleComparisonHTML = `
            <div class="feedback-section" style="margin-top: 1.5rem; background: #f0f9ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid var(--primary-color);">
                <h4>📚 范文对比 / Example Comparison</h4>
                <p style="margin: 0.5rem 0;"><strong>相似范文 / Similar Example:</strong> ${escapeHtml(comp.title)}</p>
                <p style="margin: 0.5rem 0;"><strong>范文得分 / Example Score:</strong> ${comp.totalScore}/20</p>
                <p style="margin: 0.5rem 0;"><strong>相似度 / Similarity:</strong> ${comp.similarity}%</p>
                ${comp.commentary ? `<p style="margin: 0.5rem 0; color: var(--text-secondary);"><strong>点评 / Commentary:</strong> ${escapeHtml(comp.commentary)}</p>` : ''}
            </div>
        `;
    }

    document.getElementById('results-content').innerHTML = `
        <div class="task-info-card">
            <h3>${escapeHtml(task.title)}</h3>
            <p>AI 自动评分结果 / AI Auto-Scoring Results</p>
            <p style="margin-top: 0.5rem; font-size: 0.875rem; opacity: 0.8;">教师还可以调整分数并添加评语 / Teacher can adjust scores and add comments</p>
        </div>

        <div class="review-layout">
            <div class="review-left">
                <h3>我的作文 / My Writing</h3>
                <div class="content-display">${highlightGrammarErrors(escapeHtml(submission.content), submission.grammarCorrections)}</div>
                <div style="margin-top: 1rem; color: var(--text-secondary);">
                    字数: ${submission.wordCount}词
                </div>
            </div>
            <div class="review-right">
                <h3>AI 评分结果 / AI Scores</h3>
                <div class="scores-display">
                    ${task.mode === 'practice' && task.scoringCriteria ? `
                        <div class="custom-scores-display">
                            ${task.scoringCriteria.map(criterion => `
                                <div class="custom-score-item">
                                    <div class="custom-score-label">${escapeHtml(criterion.name)}</div>
                                    <div class="custom-score-value">${submission.scores.customScores?.[criterion.name] || '-'} <span class="score-total">/ ${criterion.score}</span></div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="score-item">
                            <span class="score-label">内容 / Content</span>
                            <span class="score-value">${submission.scores.content} <span class="score-total">/ 8</span></span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">语言 / Language</span>
                            <span class="score-value">${submission.scores.language} <span class="score-total">/ 8</span></span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">结构 / Structure</span>
                            <span class="score-value">${submission.scores.structure} <span class="score-total">/ 4</span></span>
                        </div>
                    `}
                    <div class="total-score">
                        <div class="total-score-value">${submission.scores.total}</div>
                        <div class="total-score-label">总分 / Total / 20</div>
                    </div>
                </div>

                <div class="feedback-display">
                    <div class="feedback-section">
                        <h4>✓ 优点 / Strengths</h4>
                        <ul>
                            ${submission.scores.feedback.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="feedback-section">
                        <h4>→ 改进建议 / Suggestions</h4>
                        <ul>
                            ${submission.scores.feedback.improvements.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
                        </ul>
                    </div>
                    ${grammarHTML}
                    ${exampleComparisonHTML}
                </div>
            </div>
        </div>

        <div style="margin-top: 1.5rem; text-align: center;">
            <button onclick="closeModal('results-modal'); loadStudentDashboard();" class="btn btn-primary">关闭 / Close</button>
        </div>
    `;

    showModal('results-modal');
    loadStudentDashboard();
}

function checkGrammar(content) {
    const corrections = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Case and capitalization errors - only flag actual errors
    const caseErrors = [
        // Lowercase "i" when it should be "I"
        { pattern: /\bi\s+(am|was|have|had|will|would|can|could|shall|should|may|might|do|did|don't|think|know|want|need|like|love|hope|believe|feel|see|hear|go|went|come|came|make|made|take|took|give|gave|get|got|say|said|tell|told|read|write|wrote|live|lived|work|worked|study|studied|play|played|eat|ate|drink|drank|run|ran|walk|walked|sit|sat|stand|stood|sleep|slept|wake|woke|drive|drove|fly|flew|swim|swam|ride|rode|buy|bought|sell|sold|bring|brought|begin|began|choose|chose|speak|spoke|break|broke|forget|forgot|lose|lost|teach|taught|understand|understood|wear|wore|catch|caught|draw|drew|grow|grew|cut|put|let|set|hit|hurt|shut|split|spread|cost|cast|burst|bid|quit|rid|wet|wed|bet)\b/gi, correction: 'I', explanation: '第一人称"I"必须大写', validator: (match) => match.startsWith('i ') },
        // Lowercase "dear" at start - only if actually lowercase
        { pattern: /^dear\s+\w+/gim, correction: null, explanation: '称呼应大写：Dear', validator: (match) => match[0] === 'd' },
        // Lowercase "yours" in signature - only if actually lowercase
        { pattern: /^yours,\s*\n?\s*\w+/gim, correction: null, explanation: '署名应大写：Yours', validator: (match) => match[0] === 'y' }
    ];

    // Subject-verb agreement errors
    const agreementErrors = [
        { pattern: /\b(he|she|it)\s+(don't|doesn't|isn't|aren't|wasn't|weren't|have|has|had)\b/gi, correction: null, explanation: '主谓一致错误：第三人称单数应使用doesn\'t/is/has' },
        { pattern: /\b(i|we|you|they|we)\s+(doesn't|isn't|wasn't|has)\b/gi, correction: null, explanation: '主谓一致错误：应使用don\'t/are/were/have' },
        { pattern: /\b(he|she|it)\s+(do|does)\s+not\b/gi, correction: null, explanation: '建议使用缩写形式：doesn\'t' },
        { pattern: /\bthese\s+(is|was)\b/gi, correction: 'these are/were', explanation: 'these后应使用复数动词' },
        { pattern: /\bthose\s+(is|was)\b/gi, correction: 'those are/were', explanation: 'those后应使用复数动词' },
        { pattern: /\bthis\s+(are|were)\b/gi, correction: 'this is/was', explanation: 'this后应使用单数动词' },
        { pattern: /\bthat\s+(are|were)\b/gi, correction: 'that is/was', explanation: 'that后应使用单数动词' }
    ];

    // Tense consistency errors
    const tenseErrors = [
        { pattern: /\byesterday\s+(go|come|see|meet|have|do|make|take|give|get|find|think|know|say|tell|ask|write|read|run|walk|sit|stand|sleep|wake|drive|fly|swim|ride|buy|bring|begin|choose|speak|break|forget|lose|teach|understand|wear|catch|draw|grow|cut)\b/gi, correction: null, explanation: 'yesterday后应使用过去式' },
        { pattern: /\blast\s+(week|month|year|night|time)\s+(go|come|see|meet|have|do|make|take|give|get|find|think|know|say|tell|ask|write|read|run|walk|sit|stand|sleep|wake|drive|fly|swim|ride|buy|bring|begin|choose|speak|break|forget|lose|teach|understand|wear|catch|draw|grow|cut)\b/gi, correction: null, explanation: 'last+时间后应使用过去式' },
        { pattern: /\balready\s+(go|come|see|meet|have|do|make|take|give|get|find|think|know|say|tell|ask|write|read|run|walk|sit|stand|sleep|wake|drive|fly|swim|ride|buy|bring|begin|choose|speak|break|forget|lose|teach|understand|wear|catch|draw|grow|cut)\b/gi, correction: null, explanation: 'already后应使用完成时或过去式' }
    ];

    // Article errors (a/an/the)
    const articleErrors = [
        { pattern: /\ba\s+([aeiou]\w+)/gi, correction: 'an $1', explanation: '元音音素开头的词前应使用an' },
        { pattern: /\ban\s+([bcdfghjklmnpqrstvwxyz]\w+)/gi, correction: 'a $1', explanation: '辅音音素开头的词前应使用a' },
        { pattern: /\bthe\s+(school|home|bed|church|hospital|prison|college|university)\s+(is|are|was|were)\b/gi, correction: null, explanation: '表示泛指时不需要the：school/home/bed等' },
        { pattern: /\bgo\s+to\s+(the\s+)?(home|bed|school)\b/gi, correction: 'go home/to bed/to school', explanation: 'go home/bed/school不需要the' },
        // Missing article before singular countable nouns
        { pattern: /\b(protect|save|clean|pollute|damage)\s+(environment|nature|ecology)\b/gi, correction: null, explanation: '可数名词单数前需加限定词：the environment' },
        { pattern: /\b(a|an)\s+(information|advice|knowledge|news|homework|furniture|luggage|baggage|evidence|progress|research)\b/gi, correction: null, explanation: '不可数名词前不能加a/an' }
    ];
    
    // Non-finite verb errors (to do / doing / done)
    const nonFiniteVerbErrors = [
        // want/need/hope + to do (not base form)
        { pattern: /\b(want|need|hope|wish|expect|decide|plan|agree|choose|learn|prepare|pretend|refuse|manage|offer|promise|fail|afford)\s+(?!to\s+)(\w+)\b/gi, correction: null, explanation: '这些动词后应接to do，不是动词原形', validator: (match) => {
            const parts = match.split(/\s+/);
            const verb = parts[parts.length - 1];
            // Exclude common words that can follow these verbs
            return !['to', 'a', 'an', 'the', 'this', 'that', 'it', 'me', 'you', 'him', 'her', 'us', 'them'].includes(verb.toLowerCase());
        }},
        // enjoy/finish/practice + doing (not to do)
        { pattern: /\b(enjoy|finish|practice|consider|suggest|avoid|keep|mind|imagine|delay|risk|miss)\s+to\s+(\w+)\b/gi, correction: null, explanation: '这些动词后应接doing，不是to do' },
        // Verb + verb without to or ing (I want go -> I want to go)
        { pattern: /\b(want|need|hope|wish|decide|plan|agree|choose|learn|prepare)\s+(go|come|see|do|make|take|give|get|find|know|say|tell|ask|write|read|run|walk|sit|stand|sleep|wake|drive|fly|swim|ride|buy|bring|begin|choose|speak|break|forget|lose|teach|understand|wear|catch|draw|grow|cut|eat|drink)\b/gi, correction: null, explanation: '应使用to do形式：want to go, need to do' },
        // sat/stood there + verb-ing (not base form)
        { pattern: /\b(sat|stood|lay|remained)\s+(there|here)\s+(\w+ing)\b/gi, correction: null, explanation: '正确：sat there reading', validator: () => false },
        { pattern: /\b(sat|stood|lay|remained)\s+(there|here)\s+(?!to\s+)(\w+)\b/gi, correction: null, explanation: '应使用doing形式：sat there reading', validator: (match) => {
            const parts = match.split(/\s+/);
            const verb = parts[parts.length - 1];
            return !verb.endsWith('ing') && verb.length > 2;
        }}
    ];

    // Preposition errors
    const prepositionErrors = [
        { pattern: /\bdepend\s+of\b/gi, correction: 'depend on', explanation: 'depend后应接on，不是of' },
        { pattern: /\bafraid\s+of\s+(to\s+\w+)\b/gi, correction: 'afraid to', explanation: 'afraid to do sth，不是afraid of to do' },
        { pattern: /\blook\s+forward\s+to\s+(\w+ing|to\s+\w+)\b/gi, correction: null, explanation: 'look forward to后接doing或名词' },
        { pattern: /\binsist\s+on\s+(to\s+\w+)\b/gi, correction: 'insist on doing', explanation: 'insist on后接doing，不是to do' },
        { pattern: /\bsucceed\s+in\s+(to\s+\w+)\b/gi, correction: 'succeed in doing', explanation: 'succeed in后接doing，不是to do' },
        { pattern: /\bgood\s+in\b/gi, correction: 'good at', explanation: '擅长某事应使用good at，不是good in' },
        { pattern: /\binterested\s+on\b/gi, correction: 'interested in', explanation: '对...感兴趣应使用interested in' },
        { pattern: /\bafraid\s+from\b/gi, correction: 'afraid of', explanation: '害怕应使用afraid of' },
        { pattern: /\bdifferent\s+with\b/gi, correction: 'different from', explanation: '与...不同应使用different from' },
        { pattern: /\bsimilar\s+with\b/gi, correction: 'similar to', explanation: '与...相似应使用similar to' }
    ];

    // Countable/uncountable noun errors
    const nounErrors = [
        { pattern: /\b(informations|advices|knowledges|news|homeworks|furnitures|luggages|baggages|evidences|progresses|researches)\b/gi, correction: null, explanation: '该词是不可数名词，不能加s' },
        { pattern: /\b(an?)\s+(informations|advices|knowledges|news|homeworks|furnitures|luggages|baggages|evidences|progresses|researches)\b/gi, correction: null, explanation: '不可数名词前不能加a/an' },
        { pattern: /\bmany\s+(information|advice|knowledge|news|homework|furniture|luggage|baggage|evidence|progress|research)\b/gi, correction: 'much', explanation: '不可数名词应使用much，不是many' },
        { pattern: /\bfew\s+(information|advice|knowledge|news|homework|furniture|luggage|baggage|evidence|progress|research)\b/gi, correction: 'little', explanation: '不可数名词应使用little，不是few' }
    ];

    // Common Chinglish patterns (expanded)
    const chinglishPatterns = [
        { pattern: /\bplay\s+(computer|phone|mobile|game|basketball|football|ping-pong|tennis)\b/gi, correction: 'use/play', explanation: '中式英语：play computer → use computer; play basketball可以但play computer不行' },
        { pattern: /\b(open|close)\s+(the|your)?\s*(computer|phone|light|fan|door|window)\b/gi, correction: 'turn on/off', explanation: '中式英语：开关电器应使用turn on/off，不是open/close' },
        { pattern: /\blearn\s+(knowledge|skills|abilities)\b/gi, correction: 'gain/acquire/develop', explanation: '中式英语：learn knowledge → gain knowledge' },
        { pattern: /\bvery\s+(like|love|enjoy|prefer|want|need|hope|wish)\b/gi, correction: 'really like/love', explanation: '中式英语：very like → really like' },
        { pattern: /\b(because|although|though|if|when|while)\s+.+\s+(so|but|and|or)\b/gi, correction: null, explanation: '连词错误：although/because不能与but/so连用' },
        { pattern: /\bmore\s+and\s+more\s+\w+\b/gi, correction: null, explanation: '建议：使用increasingly/growing等更地道的表达' },
        { pattern: /\bwith\s+the\s+development\s+of\b/gi, correction: null, explanation: '中式英语：建议用As...develops/With...developing' },
        { pattern: /\bin\s+my\s+opinion,?\s+i\s+think\b/gi, correction: 'In my opinion/I think', explanation: '冗余表达：in my opinion和I think重复' },
        { pattern: /\bnot\s+only\s+.+\s+but\s+also\s+.+\b/gi, correction: null, explanation: '注意not only...but also的平行结构' },
        { pattern: /\bthe\s+number\s+of\s+\w+\s+(are|were|have)\b/gi, correction: 'is/was/has', explanation: 'the number of+复数名词，谓语用单数' },
        { pattern: /\ba\s+number\s+of\s+\w+\s+(is|was|has)\b/gi, correction: 'are/were/have', explanation: 'a number of+复数名词，谓语用复数' },
        { pattern: /\beach\s+of\s+\w+\s+(are|were|have)\b/gi, correction: 'is/was/has', explanation: 'each of+复数名词，谓语用单数' },
        { pattern: /\bnone\s+of\s+\w+\s+(is|was|has)\b/gi, correction: 'are/were/have', explanation: 'none of+复数名词，谓语通常用复数' }
    ];

    // Word form errors (using wrong part of speech)
    const wordFormErrors = [
        { pattern: /\b(very|extremely|quite|rather|fairly)\s+(importance|success|failure|difficulty|possibility|ability|capacity)\b/gi, correction: null, explanation: '副词不能直接修饰名词，应使用形容词形式' },
        { pattern: /\b(a|an|the|this|that|my|your|his|her|our|their)\s+(beautifully|quickly|slowly|carefully|happily|sadly|angrily)\b/gi, correction: null, explanation: '冠词/代词后应接名词或形容词，不是副词' },
        { pattern: /\b(become|get|turn|grow)\s+(quickly|slowly|carefully|happily|sadly|angrily|beautifully)\b/gi, correction: null, explanation: '系动词后应接形容词，不是副词' }
    ];

    // Spelling errors (common mistakes)
    const spellingErrors = [
        { pattern: /\b(recieve)\b/gi, correction: 'receive', explanation: '拼写错误：recieve → receive' },
        { pattern: /\b(belive)\b/gi, correction: 'believe', explanation: '拼写错误：belive → believe' },
        { pattern: /\b(becouse|becouse|becuse)\b/gi, correction: 'because', explanation: '拼写错误：becouse → because' },
        { pattern: /\b(wich)\b/gi, correction: 'which', explanation: '拼写错误：wich → which' },
        { pattern: /\b(thier)\b/gi, correction: 'their', explanation: '拼写错误：thier → their' },
        { pattern: /\b(freind)\b/gi, correction: 'friend', explanation: '拼写错误：freind → friend' },
        { pattern: /\b(seperate)\b/gi, correction: 'separate', explanation: '拼写错误：seperate → separate' },
        { pattern: /\b(definately|definatly)\b/gi, correction: 'definitely', explanation: '拼写错误：definately → definitely' },
        { pattern: /\b(occured)\b/gi, correction: 'occurred', explanation: '拼写错误：occured → occurred (双写r)' },
        { pattern: /\b(begining)\b/gi, correction: 'beginning', explanation: '拼写错误：begining → beginning (双写n)' },
        { pattern: /\b(refered)\b/gi, correction: 'referred', explanation: '拼写错误：refered → referred (双写r)' },
        { pattern: /\b(prefered)\b/gi, correction: 'preferred', explanation: '拼写错误：prefered → preferred (双写r)' },
        { pattern: /\b(stoping)\b/gi, correction: 'stopping', explanation: '拼写错误：stoping → stopping (双写p)' },
        { pattern: /\b(siting)\b/gi, correction: 'sitting', explanation: '拼写错误：siting → sitting (双写t)' },
        { pattern: /\b(runing)\b/gi, correction: 'running', explanation: '拼写错误：runing → running (双写n)' },
        { pattern: /\b(swiming)\b/gi, correction: 'swimming', explanation: '拼写错误：swiming → swimming (双写m)' },
        { pattern: /\b(puting)\b/gi, correction: 'putting', explanation: '拼写错误：puting → putting (双写t)' },
        { pattern: /\b(geting)\b/gi, correction: 'getting', explanation: '拼写错误：geting → getting (双写t)' },
        { pattern: /\b(hoping)\b/gi, correction: 'hoping', explanation: '拼写正确' },
        { pattern: /\b(hopeing)\b/gi, correction: 'hoping', explanation: '拼写错误：hopeing → hoping (去e加ing)' },
        { pattern: /\b(makeing)\b/gi, correction: 'making', explanation: '拼写错误：makeing → making (去e加ing)' },
        { pattern: /\b(takeing)\b/gi, correction: 'taking', explanation: '拼写错误：takeing → taking (去e加ing)' },
        { pattern: /\b(haveing)\b/gi, correction: 'having', explanation: '拼写错误：haveing → having (去e加ing)' },
        { pattern: /\b(writeing)\b/gi, correction: 'writing', explanation: '拼写错误：writeing → writing (去e加ing)' },
        { pattern: /\b(driveing)\b/gi, correction: 'driving', explanation: '拼写错误：driveing → driving (去e加ing)' },
        { pattern: /\b(photoes)\b/gi, correction: 'photos', explanation: 'photo的复数是photos，不是photoes' },
        { pattern: /\b(pianoes)\b/gi, correction: 'pianos', explanation: 'piano的复数是pianos，不是pianoes' },
        { pattern: /\b(zeroes)\b/gi, correction: 'zeros', explanation: 'zero的复数是zeros，不是zeroes' },
        { pattern: /\b(studying)\b/gi, correction: 'studying', explanation: '拼写正确' },
        { pattern: /\b(studing)\b/gi, correction: 'studying', explanation: '拼写错误：studing → studying (y变i加ing)' },
        { pattern: /\b(tryed)\b/gi, correction: 'tried', explanation: '拼写错误：tryed → tried (y变i加ed)' },
        { pattern: /\b(carryed)\b/gi, correction: 'carried', explanation: '拼写错误：carryed → carried (y变i加ed)' },
        { pattern: /\b(studyed)\b/gi, correction: 'studied', explanation: '拼写错误：studyed → studied (y变i加ed)' }
    ];

    // Sentence structure errors
    const structureErrors = [
        { pattern: /\bthere\s+be\s+\w+\s+(is|are|was|were)\b/gi, correction: null, explanation: 'there be句型错误：不能重复使用be动词' },
        { pattern: /\b(although|though|because|since|as|if|when|while|until|unless)\s+.+\.\s*(so|but|and|or|however|therefore)\b/gi, correction: null, explanation: '从句后不应再使用连词' },
        { pattern: /\.\s+(but|and|so|or|however|therefore|moreover|furthermore|besides)\s+/gi, correction: null, explanation: '句首使用连词时应注意句子完整性' }
    ];

    // Verb pattern errors (infinitive/gerund mistakes) - only actual errors
    const verbPatternErrors = [
        // Passive voice: be + base form (wrong) should be be + past participle
        { pattern: /\b(be|is|are|was|were|been|being)\s+(hold|keep|make|take|give|get|find|see|hear|feel|let|have|do|go|come|bring|send|write|read|speak|tell|ask|show|teach|build|break|choose|draw|drive|eat|fall|fly|forget|grow|hide|know|lead|leave|lend|lie|lose|mean|meet|pay|put|ride|ring|rise|run|say|sell|send|set|shake|shine|shoot|shut|sing|sink|sit|sleep|slide|smell|spell|spend|spill|spit|split|spread|stand|steal|stick|sting|swear|sweep|swim|swing|take|teach|tear|tell|think|throw|understand|wake|wear|win|write)\b(?!ed|en|t)\b/gi, correction: null, explanation: '被动语态错误：be+过去分词，如be held/be kept', validator: (match) => {
            const parts = match.split(/\s+/);
            const verb = parts[parts.length - 1];
            // Check if it's a base form that should be past participle
            const irregulars = {'hold':'held','keep':'kept','make':'made','take':'taken','give':'given','get':'got','find':'found','see':'seen','hear':'heard','feel':'felt','let':'let','have':'had','do':'done','go':'gone','come':'come','bring':'brought','send':'sent','write':'written','read':'read','speak':'spoken','tell':'told','ask':'asked','show':'shown','teach':'taught','build':'built','break':'broken','choose':'chosen','draw':'drawn','drive':'driven','eat':'eaten','fall':'fallen','fly':'flown','forget':'forgotten','grow':'grown','hide':'hidden','know':'known','lead':'led','leave':'left','lend':'lent','lie':'lain','lose':'lost','mean':'meant','meet':'met','pay':'paid','put':'put','ride':'ridden','ring':'rung','rise':'risen','run':'run','say':'said','sell':'sold','set':'set','shake':'shaken','shine':'shone','shoot':'shot','shut':'shut','sing':'sung','sink':'sunk','sit':'sat','sleep':'slept','slide':'slid','smell':'smelt','spell':'spelt','spend':'spent','spill':'spilt','spit':'spat','split':'split','spread':'spread','stand':'stood','steal':'stolen','stick':'stuck','sting':'stung','swear':'sworn','sweep':'swept','swim':'swum','swing':'swung','take':'taken','teach':'taught','tear':'torn','tell':'told','think':'thought','throw':'thrown','understand':'understood','wake':'woken','wear':'worn','win':'won','write':'written'};
            return irregulars[verb.toLowerCase()] !== undefined;
        }},
        // Parallel structure: to do and doing (wrong)
        { pattern: /\bto\s+(\w+)\s+and\s+(\w+ing)\b/gi, correction: null, explanation: '平行结构错误：应为to do and do', validator: (match) => true },
        // Parallel structure: doing and to do (wrong)
        { pattern: /\b(\w+ing)\s+and\s+to\s+(\w+)\b/gi, correction: null, explanation: '平行结构错误：应为doing and doing', validator: (match) => true },
        // look forward to + base form (wrong) - should be look forward to doing
        { pattern: /\b(look|looking)\s+forward\s+to\s+(hear|see|meet|get|receive|know|hear\s+from|see\s+you|meet\s+you)\b/gi, correction: 'looking forward to hearing/seeing/meeting', explanation: 'look forward to后接doing，不是to do', validator: (match) => true },
        // enjoy/finish/practice + to do (wrong) - should be doing
        { pattern: /\b(enjoy|finish|practice|consider|suggest|avoid|keep|mind|imagine|delay|risk|miss)\s+to\s+(\w+)\b/gi, correction: null, explanation: '这些动词后接doing，不接to do', validator: (match) => true },
        // want/need/hope + doing (wrong) - should be to do
        { pattern: /\b(want|need|hope|wish|expect|decide|plan|agree|choose|learn|prepare|pretend|refuse|seem|manage|offer|promise|fail|afford)\s+(\w+ing)\b/gi, correction: null, explanation: '这些动词后接to do，不接doing', validator: (match) => {
            const parts = match.split(/\s+/);
            const verb = parts[parts.length - 1];
            // Exclude common -ing words that are actually nouns
            return !['something','anything','nothing','everything','morning','evening','building','meaning','feeling'].includes(verb.toLowerCase());
        }}
    ];

    // Collect all errors
    const allErrors = [
        ...caseErrors,
        ...agreementErrors,
        ...tenseErrors,
        ...articleErrors,
        ...prepositionErrors,
        ...nounErrors,
        ...chinglishPatterns,
        ...wordFormErrors,
        ...spellingErrors,
        ...structureErrors,
        ...verbPatternErrors,
        ...nonFiniteVerbErrors
    ];

    for (let error of allErrors) {
        const matches = content.match(error.pattern);
        if (matches) {
            for (let match of matches) {
                // Use validator if available to filter false positives
                if (error.validator && !error.validator(match)) continue;

                // Skip if correction is same as match (not a real error)
                if (error.correction && match.toLowerCase() === error.correction.toLowerCase()) continue;

                corrections.push({
                    original: match,
                    correction: error.correction || match,
                    explanation: error.explanation
                });
            }
        }
    }

    // Check for repeated words
    const repeatedWords = content.match(/\b(\w+)\s+\1\b/gi);
    if (repeatedWords) {
        for (let match of repeatedWords) {
            const word = match.split(' ')[0];
            if (!['that', 'had', 'very', 'really', 'quite'].includes(word.toLowerCase())) {
                corrections.push({
                    original: match,
                    correction: word,
                    explanation: '重复单词错误'
                });
            }
        }
    }

    // Remove duplicates
    const unique = [];
    const seen = new Set();
    for (let c of corrections) {
        const key = c.original.toLowerCase() + '|' + c.explanation;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(c);
        }
    }

    return unique;
}

// Detect advanced sentence patterns for bonus scoring
function detectAdvancedPatterns(content) {
    const patterns = {
        relativeClauses: 0,
        nonRestrictiveClauses: 0,
        adverbialInversion: 0,
        itPatterns: 0,
        emphasisPatterns: 0,
        participleAdverbial: 0,
        withCompound: 0,
        onlyInversion: 0
    };
    
    // Relative clauses (which/who/that)
    const relativeMatches = content.match(/\b\w+\s+(which|who|that)\s+\w+/gi) || [];
    patterns.relativeClauses = relativeMatches.length;
    
    // Non-restrictive relative clauses (, which...)
    const nonRestrictiveMatches = content.match(/,\s*which\s+\w+/gi) || [];
    patterns.nonRestrictiveClauses = nonRestrictiveMatches.length;
    
    // Adverbial inversion (adj./adv. + as + subject + verb)
    const inversionMatches = content.match(/\b\w+(ly)?\s+as\s+\w+\s+\w+/gi) || [];
    patterns.adverbialInversion = inversionMatches.filter(m => /tired\s+as|happy\s+as|difficult\s+as|hard\s+as/i.test(m)).length;
    
    // It patterns (It is adj. for sb. to do)
    const itPatternMatches = content.match(/\bit\s+is\s+\w+\s+for\s+\w+\s+to\s+\w+/gi) || [];
    patterns.itPatterns = itPatternMatches.length;
    
    // Emphasis patterns (It is ... that)
    const emphasisMatches = content.match(/\bit\s+is\s+.+?\s+that\s+/gi) || [];
    patterns.emphasisPatterns = emphasisMatches.length;
    
    // Participle as adverbial (Doing/Done..., main clause)
    const participleMatches = content.match(/\b\w+ing,\s+\w+/gi) || [];
    patterns.participleAdverbial = participleMatches.length;
    
    // With compound structure (with + object + complement)
    const withMatches = content.match(/\bwith\s+\w+\s+\w+(ed|ing)\b/gi) || [];
    patterns.withCompound = withMatches.length;
    
    // Only inversion (Only + adverbial + auxiliary + subject)
    const onlyMatches = content.match(/\bonly\s+\w+\s+(can|could|will|would|shall|should|do|does|did)\s+\w+/gi) || [];
    patterns.onlyInversion = onlyMatches.length;
    
    return patterns;
}

function highlightGrammarErrors(content, corrections) {
    if (!corrections || corrections.length === 0) return content;

    let highlighted = content;
    for (let c of corrections) {
        if (c.original !== c.correction) {
            const regex = new RegExp(c.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            highlighted = highlighted.replace(regex, `<span class="highlight-error">${c.original}</span>`);
        }
    }
    return highlighted;
}

// AI Scoring
function scoreSubmission(submission) {
    const task = getTaskById(submission.taskId);
    const content = submission.content.toLowerCase();
    const wordCount = submission.wordCount;

    // Analyze content based on task requirements
    const mainPoints = extractMainPoints(task.prompt);
    const coverage = analyzeCoverage(content, mainPoints);
    
    // Check if this is Practice Mode with custom criteria
    if (task.mode === 'practice' && task.scoringCriteria) {
        return scoreSubmissionPracticeMode(submission, task, content, coverage, mainPoints);
    }

    // Test Mode: Standard Beijing Gaokao scoring
    return scoreSubmissionTestMode(submission, task, content, coverage, mainPoints);
}

// Find similar examples for calibration
function findSimilarExamples(task, submission) {
    const examples = JSON.parse(localStorage.getItem('examples') || '[]');
    
    // Filter examples related to this task or general examples
    const relevantExamples = examples.filter(ex => {
        return !ex.taskId || ex.taskId === task.id;
    });
    
    // Calculate similarity scores based on content features
    const submissionWords = submission.content.toLowerCase().split(/\s+/).length;
    const submissionSentences = submission.content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    return relevantExamples.map(ex => {
        const exWords = ex.content.toLowerCase().split(/\s+/).length;
        const exSentences = ex.content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        // Simple similarity based on length
        const wordSimilarity = 1 - Math.abs(submissionWords - exWords) / Math.max(submissionWords, exWords);
        const sentenceSimilarity = 1 - Math.abs(submissionSentences - exSentences) / Math.max(submissionSentences, exSentences);
        
        return {
            example: ex,
            similarity: (wordSimilarity + sentenceSimilarity) / 2
        };
    }).sort((a, b) => b.similarity - a.similarity);
}

// Calibrate scores based on similar examples
function calibrateWithExamples(scores, similarExamples, task) {
    if (similarExamples.length === 0) return scores;
    
    // Use top 3 most similar examples
    const topExamples = similarExamples.slice(0, 3);
    
    // Calculate average scores from examples
    const avgTotalScore = topExamples.reduce((sum, item) => sum + item.example.totalScore, 0) / topExamples.length;
    
    // Adjust scores to be closer to example averages (with 30% weight)
    const calibrationWeight = 0.3;
    
    if (task.mode === 'practice' && task.scoringCriteria) {
        // Calibrate each criterion
        task.scoringCriteria.forEach(criterion => {
            const criterionName = criterion.name;
            const currentScore = scores.customScores[criterionName] || 0;
            
            // Find average for this criterion in examples
            const avgCriterionScore = topExamples.reduce((sum, item) => {
                return sum + ((item.example.criterionScores && item.example.criterionScores[criterionName]) || 0);
            }, 0) / topExamples.length;
            
            // Calibrate
            scores.customScores[criterionName] = Math.round(
                (currentScore * (1 - calibrationWeight) + avgCriterionScore * calibrationWeight) * 2
            ) / 2;
        });
        
        // Recalculate total
        scores.total = Math.round(
            Object.values(scores.customScores).reduce((a, b) => a + b, 0) * 2
        ) / 2;
    }
    
    return scores;
}

function scoreSubmissionPracticeMode(submission, task, content, coverage, mainPoints) {
    const wordCount = submission.wordCount;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const grammarErrors = checkGrammar(submission.content);
    const errorCount = grammarErrors.length;
    
    const customScores = {};
    const criteriaMap = {
        '内容': 'content',
        'content': 'content',
        '语言': 'language',
        'language': 'language',
        '结构': 'structure',
        'structure': 'structure',
        '书写': 'handwriting',
        'handwriting': 'handwriting'
    };
    
    // Score each custom criterion
    task.scoringCriteria.forEach(criterion => {
        const criterionName = criterion.name.toLowerCase();
        let score = 0;
        const maxScore = criterion.score;
        
        // Content scoring
        if (criterionName.includes('内容') || criterionName.includes('content')) {
            const coveragePercent = (coverage.covered / coverage.total) * 100;
            score = (coveragePercent / 100) * maxScore;
            
            // Check for richness
            const hasNumbers = /\d+/.test(content);
            const hasSpecificPlaces = /\b(park|museum|library|school|center|hall|garden|square)\b/i.test(content);
            const hasSpecificActivities = /\b(visit|learn|experience|explore|discover|practice|create|build|organize|prepare)\b/i.test(content);
            const hasReasons = /\b(because|since|as|reason|due to|in order to|so that)\b/i.test(content);
            const hasBenefits = /\b(benefit|helpful|important|valuable|meaningful|useful|good for|contribute to)\b/i.test(content);
            const hasFeelings = /\b(excited|happy|glad|pleased|delighted|interested|inspired|motivated|encouraged)\b/i.test(content);
            const depthIndicators = [hasNumbers, hasSpecificPlaces, hasSpecificActivities, hasReasons, hasBenefits, hasFeelings].filter(Boolean).length;
            
            if (depthIndicators >= 4) score = Math.min(maxScore, score * 1.2);
            else if (depthIndicators >= 2) score = Math.min(maxScore, score * 1.1);
        }
        
        // Language scoring
        else if (criterionName.includes('语言') || criterionName.includes('language')) {
            score = maxScore;
            
            // Penalty for grammar errors
            if (errorCount >= 8) score -= maxScore * 0.4;
            else if (errorCount >= 5) score -= maxScore * 0.25;
            else if (errorCount >= 3) score -= maxScore * 0.15;
            else if (errorCount >= 1) score -= maxScore * 0.08;
            
            // Bonus for advanced vocabulary
            const advancedWords = ['delighted', 'initiative', 'immersed', 'sustainable', 'appreciate', 'inspired', 'rewarding', 'representative', 'administration', 'engaging', 'meaningful', 'significant', 'valuable', 'beneficial'];
            const advancedCount = advancedWords.filter(w => content.includes(w)).length;
            score = Math.min(maxScore, score + advancedCount * 0.15);
            
            // Bonus for advanced sentence patterns
            const advancedPatterns = detectAdvancedPatterns(submission.content);
            const patternCount = Object.values(advancedPatterns).reduce((a, b) => a + b, 0);
            if (patternCount >= 5) score = Math.min(maxScore, score + maxScore * 0.15);
            else if (patternCount >= 3) score = Math.min(maxScore, score + maxScore * 0.1);
            else if (patternCount >= 1) score = Math.min(maxScore, score + maxScore * 0.05);
        }
        
        // Structure scoring
        else if (criterionName.includes('结构') || criterionName.includes('structure')) {
            score = maxScore * 0.6; // Base score
            
            const hasGreeting = /^dear\s+\w+/i.test(content.trim());
            const hasClosing = /\b(yours|best regards|sincerely|truly)\b/i.test(content);
            const hasClearParagraphs = content.split('\n\n').length >= 3;
            const hasLogicalOrder = /\b(first|second|third|finally|as for|for|besides|moreover|however|therefore|in addition|in conclusion)\b/i.test(content);
            
            if (hasGreeting && hasClosing) score += maxScore * 0.1;
            if (hasClearParagraphs) score += maxScore * 0.15;
            if (hasLogicalOrder) score += maxScore * 0.15;
            
            score = Math.min(maxScore, score);
        }
        
        // Handwriting scoring (based on photo if available, otherwise give average)
        else if (criterionName.includes('书写') || criterionName.includes('handwriting')) {
            if (submission.handwritingPhoto) {
                // If photo is uploaded, give a placeholder score (teacher will adjust)
                score = maxScore * 0.7; // Default to 70% until teacher reviews
            } else {
                // No photo, give average score
                score = maxScore * 0.75;
            }
        }
        
        // Generic criterion - give base score
        else {
            score = maxScore * 0.7;
        }
        
        customScores[criterion.name] = Math.round(score * 2) / 2;
    });
    
    // Calculate total
    const totalScore = Object.values(customScores).reduce((a, b) => a + b, 0);
    
    let scores = {
        customScores: customScores,
        total: Math.round(totalScore * 2) / 2,
        coverage: coverage,
        feedback: null,
        grammarErrors: grammarErrors
    };
    
    // Calibrate with examples if available
    const similarExamples = findSimilarExamples(task, submission);
    if (similarExamples.length > 0) {
        scores = calibrateWithExamples(scores, similarExamples, task);
    }
    
    // Generate feedback
    // Find matching criteria for feedback (flexible matching for custom criterion names)
    let feedbackContentScore = 0, feedbackLanguageScore = 0, feedbackStructureScore = 0;
    task.scoringCriteria.forEach(criterion => {
        const name = criterion.name.toLowerCase();
        if (name.includes('内容') || name.includes('content')) {
            feedbackContentScore = customScores[criterion.name] || 0;
        } else if (name.includes('语言') || name.includes('language')) {
            feedbackLanguageScore = customScores[criterion.name] || 0;
        } else if (name.includes('结构') || name.includes('structure')) {
            feedbackStructureScore = customScores[criterion.name] || 0;
        }
    });
    scores.feedback = generateFeedback(coverage, feedbackContentScore, feedbackLanguageScore, feedbackStructureScore, content, grammarErrors);
    
    // Add example comparison to feedback
    if (similarExamples.length > 0) {
        const topExample = similarExamples[0].example;
        scores.feedback.exampleComparison = {
            title: topExample.title,
            totalScore: topExample.totalScore,
            similarity: Math.round(similarExamples[0].similarity * 100),
            commentary: topExample.commentary
        };
    }
    
    return scores;
}

function scoreSubmissionTestMode(submission, task, content, coverage, mainPoints) {
    const wordCount = submission.wordCount;
    
    // Score Content (0-8) - Balanced criteria
    let contentScore = 0;
    const coveragePercent = (coverage.covered / coverage.total) * 100;

    // Base score from coverage - reasonable base
    if (coveragePercent >= 100) {
        contentScore = 4.5;
    } else if (coveragePercent >= 80) {
        contentScore = 4.0;
    } else if (coveragePercent >= 60) {
        contentScore = 3.5;
    } else {
        contentScore = coveragePercent / 60 * 3.5;
    }

    // Richness and specificity checks - much stricter
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const uniqueSentences = new Set(sentences);
    const sentenceDiversity = uniqueSentences.size / Math.max(sentences.length, 1);

    // Check for specific details and examples
    const hasNumbers = /\d+/.test(content);
    const hasSpecificPlaces = /\b(park|museum|library|school|center|hall|garden|square)\b/i.test(content);
    const hasSpecificActivities = /\b(visit|learn|experience|explore|discover|practice|create|build|organize|prepare)\b/i.test(content);
    const hasReasons = /\b(because|since|as|reason|due to|in order to|so that)\b/i.test(content);
    const hasBenefits = /\b(benefit|helpful|important|valuable|meaningful|useful|good for|contribute to)\b/i.test(content);
    const hasFeelings = /\b(excited|happy|glad|pleased|delighted|interested|inspired|motivated|encouraged)\b/i.test(content);

    // Count depth indicators
    const depthIndicators = [hasNumbers, hasSpecificPlaces, hasSpecificActivities, hasReasons, hasBenefits, hasFeelings].filter(Boolean).length;

    // Check for elaboration (sentences with more than 15 words)
    const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 15).length;
    const elaborationRatio = longSentences / Math.max(sentences.length, 1);

    // Apply richness bonuses - much harder to get high scores
    if (depthIndicators >= 5 && elaborationRatio >= 0.3 && sentenceDiversity >= 0.8) {
        contentScore = Math.min(6.5, contentScore + 2.0); // Excellent richness
    } else if (depthIndicators >= 4 && elaborationRatio >= 0.2) {
        contentScore = Math.min(6.0, contentScore + 1.5); // Good richness
    } else if (depthIndicators >= 3) {
        contentScore = Math.min(5.5, contentScore + 1.0); // Basic richness
    } else if (depthIndicators >= 2) {
        contentScore = Math.min(5.0, contentScore + 0.5); // Minimal richness
    }

    // Penalty for shallow content (short sentences, little detail)
    const avgSentenceLength = content.split(/\s+/).length / Math.max(sentences.length, 1);
    if (avgSentenceLength < 8 && depthIndicators < 2) {
        contentScore = Math.max(0, contentScore - 1.5); // Very shallow
    } else if (avgSentenceLength < 10 && depthIndicators < 3) {
        contentScore = Math.max(0, contentScore - 0.8); // Somewhat shallow
    }

    // Penalty for repetitive content
    if (sentenceDiversity < 0.5) {
        contentScore = Math.max(0, contentScore - 1.0);
    }

    // Penalty for off-topic content
    const offTopicPatterns = ['great wall', 'forbidden city', 'beijing duck', 'last year', 'with my parents', 'went to', 'visited the'];
    const offTopicCount = offTopicPatterns.filter(p => content.includes(p)).length;
    if (offTopicCount >= 3) {
        contentScore = Math.max(0, contentScore - 3);
    } else if (offTopicCount >= 2) {
        contentScore = Math.max(0, contentScore - 2);
    } else if (offTopicCount >= 1) {
        contentScore = Math.max(0, contentScore - 1);
    }

    contentScore = Math.max(0, Math.min(8, contentScore)); // Final cap at 8

    // Score Language (0-8) - Balanced criteria
    let languageScore = 4.0; // Reasonable base score

    // Check for advanced vocabulary - expanded list
    const advancedWords = ['delighted', 'initiative', 'immersed', 'sustainable', 'appreciate', 'inspired', 'rewarding', 'representative', 'administration', 'engaging', 'meaningful', 'significant', 'valuable', 'beneficial', 'constructive', 'productive', 'enriching', 'fascinating', 'remarkable', 'extraordinary'];
    const advancedCount = advancedWords.filter(w => content.includes(w)).length;
    languageScore += Math.min(2.5, advancedCount * 0.3);

    // Check for complex sentences - stricter
    const hasParticiples = /\b\w+ing\s+\w+/i.test(content);
    const hasConditionals = /\b(if|when|while|as long as|in case|provided that)\b/i.test(content);
    const hasRelativeClauses = /\b(which|that|who|whom|whose)\b/i.test(content);
    const hasPassive = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/i.test(content);
    const hasSubjunctive = /\b(wish|if only|as if|as though|suggest|recommend|insist)\b/i.test(content);
    const complexCount = [hasParticiples, hasConditionals, hasRelativeClauses, hasPassive, hasSubjunctive].filter(Boolean).length;
    languageScore += Math.min(1.5, complexCount * 0.3);
    
    // Bonus for advanced sentence patterns (from the comprehensive list)
    const advancedPatterns = detectAdvancedPatterns(submission.content);
    const patternCount = Object.values(advancedPatterns).reduce((a, b) => a + b, 0);
    if (patternCount >= 5) languageScore += 0.8;
    else if (patternCount >= 3) languageScore += 0.5;
    else if (patternCount >= 1) languageScore += 0.3;

    // Check for varied sentence structures
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / Math.max(sentenceLengths.length, 1);
    const lengthVariation = sentenceLengths.filter(l => Math.abs(l - avgLength) > 5).length / Math.max(sentenceLengths.length, 1);

    if (lengthVariation > 0.3) {
        languageScore += 0.5; // Good sentence variety
    }

    // Penalty for simple/repetitive language - stricter
    const simplePhrases = ['i think', 'we can', 'it is good', 'very good', 'i like', 'i want', 'we should', 'it is'];
    const simpleCount = simplePhrases.filter(p => content.includes(p)).length;
    if (simpleCount >= 5) {
        languageScore -= 2.0;
    } else if (simpleCount >= 3) {
        languageScore -= 1.0;
    } else if (simpleCount >= 2) {
        languageScore -= 0.5;
    }

    // Penalty for grammar errors (use the grammar checker) - balanced
    const grammarErrors = checkGrammar(submission.content);
    const errorCount = grammarErrors.length;
    if (errorCount >= 8) {
        languageScore -= 2.0;
    } else if (errorCount >= 5) {
        languageScore -= 1.0;
    } else if (errorCount >= 3) {
        languageScore -= 0.5;
    } else if (errorCount >= 1) {
        languageScore -= 0.25;
    }

    languageScore = Math.max(0, Math.min(8, languageScore)); // Cap at 8

    // Score Structure (0-4, scored as /8 then halved) - Balanced
    let structureRawScore = 4.0; // Reasonable base

    // Check organization
    const hasGreeting = /^dear\s+\w+/i.test(content.trim());
    const hasClosing = /\b(yours|best regards|sincerely|truly)\b/i.test(content);
    const hasClearParagraphs = content.split('\n\n').length >= 3;
    const hasLogicalOrder = /\b(first|second|third|finally|as for|for|besides|moreover|however|therefore|in addition|in conclusion)\b/i.test(content);

    if (hasGreeting && hasClosing) structureRawScore += 0.8;
    if (hasClearParagraphs) structureRawScore += 0.8;
    if (hasLogicalOrder) structureRawScore += 0.8;

    // Check for clear topic sentences
    const paragraphStarts = content.split('\n\n').map(p => p.trim().split('.')[0]);
    const hasTopicSentences = paragraphStarts.filter(p => p.length > 20).length >= 2;
    if (hasTopicSentences) structureRawScore += 0.5;

    // Penalty for disorganized content
    const formMentionedEarly = content.indexOf('form') < content.length / 2;
    const contentMentionedAfter = content.indexOf('content') > content.length / 3;
    if (!formMentionedEarly && !contentMentionedAfter) {
        structureRawScore -= 1.0;
    } else if (!formMentionedEarly || !contentMentionedAfter) {
        structureRawScore -= 0.5;
    }

    structureRawScore = Math.max(0, Math.min(8, structureRawScore)); // Cap at 8
    let structureScore = structureRawScore / 2;

    // Calculate total
    const totalScore = Math.round((contentScore + languageScore + structureScore) * 2) / 2;

    // 18+ requires exceptional quality in ALL dimensions - even stricter
    if (totalScore >= 18) {
        // Check if truly exceptional
        const isExceptional = advancedCount >= 6 && complexCount >= 3 && coveragePercent === 100 &&
                             offTopicCount === 0 && errorCount <= 2 && depthIndicators >= 5 &&
                             sentenceDiversity >= 0.8 && elaborationRatio >= 0.3;
        if (!isExceptional) {
            // Cap at 17.5 if not truly exceptional
            const adjustedTotal = Math.min(17.5, totalScore);
            // Redistribute scores proportionally
            const ratio = adjustedTotal / totalScore;
            contentScore = Math.round(contentScore * ratio * 2) / 2;
            languageScore = Math.round(languageScore * ratio * 2) / 2;
            structureScore = Math.round(structureScore * ratio * 2) / 2;
        }
    }

    // 16+ also requires high quality
    if (totalScore >= 16 && totalScore < 18) {
        const isHighQuality = advancedCount >= 4 && complexCount >= 2 && coveragePercent >= 80 &&
                             errorCount <= 4 && depthIndicators >= 4;
        if (!isHighQuality) {
            const adjustedTotal = Math.min(15.5, totalScore);
            const ratio = adjustedTotal / totalScore;
            contentScore = Math.round(contentScore * ratio * 2) / 2;
            languageScore = Math.round(languageScore * ratio * 2) / 2;
            structureScore = Math.round(structureScore * ratio * 2) / 2;
        }
    }

    // Generate feedback
    const feedback = generateFeedback(coverage, contentScore, languageScore, structureScore, content, grammarErrors);

    return {
        content: Math.round(contentScore * 2) / 2,
        language: Math.round(languageScore * 2) / 2,
        structure: Math.round(structureScore * 2) / 2,
        total: Math.round((Math.round(contentScore * 2) / 2 + Math.round(languageScore * 2) / 2 + Math.round(structureScore * 2) / 2) * 2) / 2,
        coverage: coverage,
        feedback: feedback,
        grammarErrors: grammarErrors
    };
}

function extractMainPoints(prompt) {
    const points = [];
    const lines = prompt.split('\n');
    
    for (let line of lines) {
        const match = line.match(/\d+[．.]\s*(.+)/);
        if (match) {
            points.push(match[1].trim());
        }
    }
    
    return points.length > 0 ? points : ['活动形式', '活动内容'];
}

function analyzeCoverage(content, mainPoints) {
    let covered = 0;
    const details = [];
    
    for (let point of mainPoints) {
        const keywords = point.split('').filter(c => c.match(/[\u4e00-\u9fa5]/)).join('');
        const englishKeywords = {
            '活动形式': ['form', 'type', 'style', 'way', 'activity'],
            '活动内容': ['content', 'activity', 'do', 'visit', 'learn', 'experience']
        };
        
        let isCovered = false;
        for (let key in englishKeywords) {
            if (point.includes(key)) {
                isCovered = englishKeywords[key].some(k => content.includes(k));
                break;
            }
        }
        
        if (isCovered) covered++;
        details.push({
            point: point,
            covered: isCovered
        });
    }
    
    return {
        covered: covered,
        total: mainPoints.length,
        details: details
    };
}

function generateFeedback(coverage, contentScore, languageScore, structureScore, content, grammarErrors = []) {
    const strengths = [];
    const improvements = [];

    // Content feedback - stricter
    if (contentScore >= 6.5) {
        strengths.push('内容充实，要点覆盖全面，细节丰富');
    } else if (contentScore >= 5) {
        strengths.push('基本覆盖了主要要点');
        improvements.push('内容可以更加具体和丰富，添加更多细节、例子和理由');
    } else if (contentScore >= 3.5) {
        improvements.push('内容较为简单，需要更多细节和具体例子来支撑观点');
    } else {
        improvements.push('内容不够充实，需要覆盖所有要求的要点并添加具体细节');
    }

    // Language feedback - stricter
    if (languageScore >= 6.5) {
        strengths.push('语言丰富，使用了高级词汇和复杂句式');
    } else if (languageScore >= 5) {
        strengths.push('语言基本正确');
        improvements.push('尝试使用更多样的句式（如分词短语、条件句、被动语态）和高级词汇');
    } else if (languageScore >= 3.5) {
        improvements.push('语言较为简单，建议学习使用复杂句式和高级表达');
    } else {
        improvements.push('语言基础需要加强，注意语法准确性和句式多样性');
    }

    // Grammar feedback
    if (grammarErrors.length > 0) {
        if (grammarErrors.length >= 8) {
            improvements.push(`语法错误较多（${grammarErrors.length}处），需要仔细检查并改正`);
        } else if (grammarErrors.length >= 5) {
            improvements.push(`有${grammarErrors.length}处语法错误需要注意`);
        } else {
            improvements.push(`有${grammarErrors.length}处小错误需要修正`);
        }

        // Add specific grammar suggestions
        const errorTypes = {};
        grammarErrors.forEach(e => {
            const type = e.explanation.split('：')[0];
            errorTypes[type] = (errorTypes[type] || 0) + 1;
        });

        const topErrors = Object.entries(errorTypes).sort((a, b) => b[1] - a[1]).slice(0, 3);
        if (topErrors.length > 0) {
            improvements.push(`主要语法问题：${topErrors.map(([type, count]) => `${type}(${count}处)`).join('、')}`);
        }
    }

    // Structure feedback - stricter
    if (structureScore >= 3.5) {
        strengths.push('结构清晰，组织合理，逻辑流畅');
    } else if (structureScore >= 2.5) {
        improvements.push('注意段落组织，使用过渡词使逻辑更加清晰');
    } else {
        improvements.push('结构需要改进，建议按照"开头-主体-结尾"组织内容，并使用逻辑连接词');
    }

    // Coverage feedback
    if (coverage.covered < coverage.total) {
        const missing = coverage.details.filter(d => !d.covered).map(d => d.point);
        improvements.push(`缺少以下要点: ${missing.join(', ')}`);
    }

    return {
        strengths: strengths,
        improvements: improvements
    };
}

// Review Submission
function reviewSubmission(submissionId) {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const submission = submissions.find(s => s.id === submissionId);

    if (!submission) return;

    currentSubmissionId = submissionId;
    const task = getTaskById(submission.taskId);

    // Auto-score if not scored yet
    if (!submission.scores) {
        submission.scores = scoreSubmission(submission);
        submission.grammarCorrections = submission.scores.grammarErrors;
        submission.status = 'ai-scored';
        const index = submissions.findIndex(s => s.id === submissionId);
        submissions[index] = submission;
        localStorage.setItem('submissions', JSON.stringify(submissions));
    }

    // Display content with grammar highlights
    document.getElementById('review-content').innerHTML = `<div class="content-display">${highlightGrammarErrors(escapeHtml(submission.content), submission.grammarCorrections)}</div>`;

    // Display scores
    document.getElementById('review-scores').innerHTML = `
        <div class="score-item">
            <span class="score-label">内容 / Content</span>
            <span class="score-value">${submission.scores.content} <span class="score-total">/ 8</span></span>
        </div>
        <div class="score-item">
            <span class="score-label">语言 / Language</span>
            <span class="score-value">${submission.scores.language} <span class="score-total">/ 8</span></span>
        </div>
        <div class="score-item">
            <span class="score-label">结构 / Structure</span>
            <span class="score-value">${submission.scores.structure} <span class="score-total">/ 4</span></span>
        </div>
        <div class="total-score">
            <div class="total-score-value">${submission.scores.total}</div>
            <div class="total-score-label">总分 / Total / 20</div>
        </div>
    `;

    // Display feedback
    let grammarFeedbackHTML = '';
    if (submission.grammarCorrections && submission.grammarCorrections.length > 0) {
        grammarFeedbackHTML = `
            <div class="feedback-section" style="margin-top: 1rem;">
                <h4>✏️ 语法修正 / Grammar Corrections (${submission.grammarCorrections.length})</h4>
                <div class="grammar-corrections">
                    ${submission.grammarCorrections.slice(0, 5).map(c => `
                        <div class="grammar-item">
                            <span class="grammar-error">${escapeHtml(c.original)}</span>
                            <span class="grammar-arrow">→</span>
                            <span class="grammar-correct">${escapeHtml(c.correction)}</span>
                            <span class="grammar-explain">${escapeHtml(c.explanation)}</span>
                        </div>
                    `).join('')}
                    ${submission.grammarCorrections.length > 5 ? `<p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem;">还有 ${submission.grammarCorrections.length - 5} 处修正...</p>` : ''}
                </div>
            </div>
        `;
    }

    document.getElementById('review-feedback').innerHTML = `
        <div class="feedback-section">
            <h4>✓ 优点 / Strengths</h4>
            <ul>
                ${submission.scores.feedback.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
        </div>
        <div class="feedback-section">
            <h4>→ 改进建议 / Suggestions</h4>
            <ul>
                ${submission.scores.feedback.improvements.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
            </ul>
        </div>
        ${grammarFeedbackHTML}
    `;

    // Set adjustment inputs
    document.getElementById('adjust-content').value = submission.scores.content;
    document.getElementById('adjust-language').value = submission.scores.language;
    document.getElementById('adjust-structure').value = submission.scores.structure;
    document.getElementById('teacher-comments').value = submission.teacherComments || '';

    showModal('review-modal');
}

function publishScores() {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const index = submissions.findIndex(s => s.id === currentSubmissionId);

    if (index === -1) return;

    const contentScore = parseFloat(document.getElementById('adjust-content').value);
    const languageScore = parseFloat(document.getElementById('adjust-language').value);
    const structureScore = parseFloat(document.getElementById('adjust-structure').value);
    const teacherComments = document.getElementById('teacher-comments').value;

    submissions[index].scores.content = contentScore;
    submissions[index].scores.language = languageScore;
    submissions[index].scores.structure = structureScore;
    submissions[index].scores.total = Math.round((contentScore + languageScore + structureScore) * 2) / 2;
    submissions[index].teacherComments = teacherComments;
    submissions[index].status = 'published';
    submissions[index].publishedAt = new Date().toISOString();

    localStorage.setItem('submissions', JSON.stringify(submissions));

    if (submissions[index].scores.total > 16) {
        addToKnowledgeBase(submissions[index]);
    }

    closeModal('review-modal');
    alert('成绩已发布！' + (submissions[index].scores.total > 16 ? '\n该作文得分超过16分，已自动添加到素材库。' : ''));
    loadTeacherDashboard();
}

function addToKnowledgeBase(submission) {
    const task = getTaskById(submission.taskId);
    const theme = task ? detectTheme(task.prompt) : '通用';
    const themeMap = {
        '环保': '环保/Environmental Protection',
        '文化交流': '文化交流/Cultural Exchange',
        '志愿服务': '志愿服务/Volunteer Service',
        '校园生活': '校园生活/Campus Life',
        '科技': '科技/Technology',
        '健康': '健康/Health',
        '通用': '通用/General'
    };
    const materialTheme = themeMap[theme] || '通用/General';

    const summary = summarizeContent(submission.content);

    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    materials.push({
        id: 'mat-' + Date.now(),
        theme: materialTheme,
        title: `高分作文素材 (${submission.scores.total}分) - ${task ? task.title : '未知任务'}`,
        content: summary,
        keywords: extractKeywords(submission.content),
        source: 'auto',
        originalScore: submission.scores.total,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem('materials', JSON.stringify(materials));
}

function summarizeContent(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyPatterns = {
        suggestions: /suggest|recommend|advice|think.*should|could|might/i,
        activities: /activity|event|visit|trip|walk|festival|program/i,
        reasons: /because|since|as|reason|due to/i,
        benefits: /benefit|helpful|good|great|important|valuable/i
    };

    const keySentences = sentences.filter(s =>
        Object.values(keyPatterns).some(p => p.test(s))
    );

    const result = keySentences.length > 0 ? keySentences : sentences;
    return result.map(s => s.trim()).join('. ') + '.';
}

function extractKeywords(content) {
    const lower = content.toLowerCase();
    const keywordPool = [
        'sustainable development', 'environmental awareness', 'cultural heritage',
        'community service', 'volunteer spirit', 'traditional culture',
        'cross-cultural communication', 'green living', 'social responsibility',
        'meaningful experience', 'positive impact', 'make a contribution'
    ];
    return keywordPool.filter(k => lower.includes(k));
}

// View Submission (Student)
function viewSubmission(submissionId) {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const submission = submissions.find(s => s.id === submissionId);

    if (!submission || !submission.scores) return;

    const task = getTaskById(submission.taskId);

    let grammarHTML = '';
    if (submission.grammarCorrections && submission.grammarCorrections.length > 0) {
        grammarHTML = `
            <div class="feedback-section" style="margin-top: 1.5rem;">
                <h4>✏️ 语法修正 / Grammar Corrections</h4>
                <div class="grammar-corrections">
                    ${submission.grammarCorrections.map(c => `
                        <div class="grammar-item">
                            <span class="grammar-error">${escapeHtml(c.original)}</span>
                            <span class="grammar-arrow">→</span>
                            <span class="grammar-correct">${escapeHtml(c.correction)}</span>
                            <span class="grammar-explain">${escapeHtml(c.explanation)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const statusText = submission.status === 'published' ? '教师已评阅' : 'AI自动评分';
    const statusClass = submission.status === 'published' ? 'status-published' : 'status-reviewed';

    document.getElementById('results-content').innerHTML = `
        <div class="task-info-card">
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.prompt)}</p>
            <div style="margin-top: 0.75rem;">
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${submission.status === 'ai-scored' ? '<p style="margin-top: 0.5rem; font-size: 0.875rem; opacity: 0.8;">教师还可以调整分数并添加评语</p>' : ''}
            </div>
        </div>

        <div class="review-layout">
            <div class="review-left">
                <h3>我的作文 / My Writing</h3>
                <div class="content-display">${highlightGrammarErrors(escapeHtml(submission.content), submission.grammarCorrections)}</div>
                <div style="margin-top: 1rem; color: var(--text-secondary);">
                    字数: ${submission.wordCount}词 |
                    提交时间: ${new Date(submission.submittedAt).toLocaleString('zh-CN')}
                </div>
            </div>
            <div class="review-right">
                <h3>评分结果 / Scores</h3>
                <div class="scores-display">
                    <div class="score-item">
                        <span class="score-label">内容 / Content</span>
                        <span class="score-value">${submission.scores.content} <span class="score-total">/ 8</span></span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">语言 / Language</span>
                        <span class="score-value">${submission.scores.language} <span class="score-total">/ 8</span></span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">结构 / Structure</span>
                        <span class="score-value">${submission.scores.structure} <span class="score-total">/ 4</span></span>
                    </div>
                    <div class="total-score">
                        <div class="total-score-value">${submission.scores.total}</div>
                        <div class="total-score-label">总分 / Total / 20</div>
                    </div>
                </div>

                <div class="feedback-display">
                    <div class="feedback-section">
                        <h4>✓ 优点 / Strengths</h4>
                        <ul>
                            ${submission.scores.feedback.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="feedback-section">
                        <h4>→ 改进建议 / Suggestions</h4>
                        <ul>
                            ${submission.scores.feedback.improvements.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
                        </ul>
                    </div>
                    ${grammarHTML}
                    ${submission.teacherComments ? `
                        <div class="feedback-section">
                            <h4>💬 教师评语 / Teacher Comments</h4>
                            <p style="color: var(--text-secondary); line-height: 1.8;">${escapeHtml(submission.teacherComments)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    showModal('results-modal');
}

// Example Management
function showAddExample() {
    document.getElementById('example-form').reset();
    
    // Populate task dropdown
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskSelect = document.getElementById('example-task-link');
    taskSelect.innerHTML = '<option value="">通用范文 / General Example</option>';
    tasks.forEach(task => {
        taskSelect.innerHTML += `<option value="${task.id}">${task.title}</option>`;
    });
    
    // Show criteria scores based on mode
    updateExampleCriteriaScores();
    
    showModal('example-modal');
}

function updateExampleCriteriaScores() {
    const taskId = document.getElementById('example-task-link').value;
    const container = document.getElementById('example-criteria-container');
    
    if (taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const task = tasks.find(t => t.id === taskId);
        
        if (task && task.mode === 'practice' && task.scoringCriteria) {
            container.innerHTML = task.scoringCriteria.map(criterion => `
                <div class="scoring-criterion">
                    <label style="flex:1;">${criterion.name} (/${criterion.score})</label>
                    <input type="number" class="example-criterion-score" data-name="${criterion.name}" 
                           min="0" max="${criterion.score}" step="0.5" placeholder="得分" style="width:100px;">
                </div>
            `).join('');
            return;
        }
    }
    
    // Default: Test Mode criteria
    container.innerHTML = `
        <div class="scoring-criterion">
            <label style="flex:1;">内容 Content (/8)</label>
            <input type="number" class="example-criterion-score" data-name="内容 Content" 
                   min="0" max="8" step="0.5" placeholder="得分" style="width:100px;">
        </div>
        <div class="scoring-criterion">
            <label style="flex:1;">语言 Language (/8)</label>
            <input type="number" class="example-criterion-score" data-name="语言 Language" 
                   min="0" max="8" step="0.5" placeholder="得分" style="width:100px;">
        </div>
        <div class="scoring-criterion">
            <label style="flex:1;">结构 Structure (/4)</label>
            <input type="number" class="example-criterion-score" data-name="结构 Structure" 
                   min="0" max="4" step="0.5" placeholder="得分" style="width:100px;">
        </div>
    `;
}

function saveExample() {
    const title = document.getElementById('example-title').value.trim();
    const scoreBand = document.getElementById('example-score-band').value;
    const totalScore = parseFloat(document.getElementById('example-total-score').value);
    const taskId = document.getElementById('example-task-link').value;
    const content = document.getElementById('example-content').value.trim();
    const commentary = document.getElementById('example-commentary').value.trim();
    
    if (!title || !content || isNaN(totalScore)) {
        alert('请填写标题、内容和总分 / Please fill in title, content and total score');
        return;
    }
    
    // Collect criterion scores
    const criterionScores = {};
    document.querySelectorAll('.example-criterion-score').forEach(input => {
        const name = input.dataset.name;
        const score = parseFloat(input.value);
        if (!isNaN(score)) {
            criterionScores[name] = score;
        }
    });
    
    const examples = JSON.parse(localStorage.getItem('examples') || '[]');
    examples.push({
        id: 'example-' + Date.now(),
        title: title,
        scoreBand: scoreBand,
        totalScore: totalScore,
        taskId: taskId || null,
        criterionScores: criterionScores,
        content: content,
        commentary: commentary,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('examples', JSON.stringify(examples));
    closeModal('example-modal');
    renderExamplesList();
    renderExamplesListStudent();
    alert('范文添加成功！/ Example added successfully!');
}

function viewExample(exampleId) {
    const examples = JSON.parse(localStorage.getItem('examples') || '[]');
    const example = examples.find(e => e.id === exampleId);
    
    if (!example) return;
    
    const badgeClass = example.scoreBand === '17-19' ? 'badge-excellent' : 
                      example.scoreBand === '13-15' ? 'badge-good' : 'badge-pass';
    
    document.getElementById('results-content').innerHTML = `
        <div class="task-info-card">
            <h3>${escapeHtml(example.title)}</h3>
            <span class="badge ${badgeClass}" style="font-top: 0.5rem;">${example.scoreBand}分</span>
        </div>
        
        <div class="review-left" style="margin-bottom: 1.5rem;">
            <h3>作文内容 / Content</h3>
            <div class="content-display">${escapeHtml(example.content)}</div>
        </div>
        
        ${example.commentary ? `
            <div class="feedback-display">
                <div class="feedback-section">
                    <h4>📝 点评 / Commentary</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8;">${escapeHtml(example.commentary)}</p>
                </div>
            </div>
        ` : ''}
    `;
    
    showModal('results-modal');
}

function deleteExample(exampleId) {
    if (!confirm('确定要删除这篇范文吗？')) return;
    
    let examples = JSON.parse(localStorage.getItem('examples') || '[]');
    examples = examples.filter(e => e.id !== exampleId);
    localStorage.setItem('examples', JSON.stringify(examples));
    renderExamplesList();
    renderExamplesListStudent();
}

// Task Analysis View
function viewTaskAnalysis(taskId) {
    const task = getTaskById(taskId);
    if (!task || !task.analysis) return;
    
    const analysis = task.analysis;
    
    document.getElementById('analysis-content').innerHTML = `
        <div class="task-info-card">
            <h3>${escapeHtml(task.title)}</h3>
            <p><strong>主题:</strong> ${analysis.theme}</p>
        </div>
        
        <div class="analysis-section">
            <h3>要点分析 / Main Points</h3>
            <ul class="analysis-list">
                ${analysis.mainPoints.map((p, i) => `<li><strong>要点${i+1}:</strong> ${escapeHtml(p)}</li>`).join('')}
            </ul>
        </div>
        
        <div class="analysis-section">
            <h3>思维导图 / Mindmap</h3>
            <div class="mindmap-container">
                <div class="mindmap-center">${escapeHtml(analysis.mindmap.centralTopic)}</div>
                <div class="mindmap-branches">
                    ${analysis.mindmap.branches.map(branch => `
                        <div class="mindmap-branch">
                            <div class="branch-topic">${escapeHtml(branch.topic)}</div>
                            <div class="branch-ideas">
                                <strong>建议:</strong>
                                <ul>${branch.ideas.map(idea => `<li>${escapeHtml(idea)}</li>`).join('')}</ul>
                                <strong>好表达:</strong>
                                <ul>${branch.usefulExpressions.map(exp => `<li>${escapeHtml(exp)}</li>`).join('')}</ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h3>相关素材 / Related Materials</h3>
            ${analysis.relatedMaterials.length > 0 ? `
                <div class="materials-grid">
                    ${analysis.relatedMaterials.map(mat => `
                        <div class="material-card-small">
                            <div class="material-title">${escapeHtml(mat.title)}</div>
                            <div class="material-content">${escapeHtml(mat.content)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>暂无相关素材</p>'}
        </div>
        
        <div class="analysis-section">
            <h3>评分指导 / Scoring Guidance</h3>
            <div class="guidance-card">
                <p><strong>18+分标准:</strong> ${analysis.scoringGuidance.highScoreCriteria}</p>
                <p><strong>主题要点:</strong> ${analysis.scoringGuidance.themeSpecificNotes}</p>
                <p><strong>常见错误:</strong> ${analysis.scoringGuidance.commonMistakes.join(', ')}</p>
            </div>
        </div>
    `;
    
    showModal('analysis-modal');
}

// Material Bank
function renderMaterialsList() {
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const container = document.getElementById('materials-list');
    const filterContainer = document.getElementById('theme-filters');
    
    // Get unique themes
    const themes = [...new Set(materials.map(m => m.theme))];
    
    // Render theme filters
    filterContainer.innerHTML = `
        <button onclick="filterMaterials('all')" class="theme-filter-btn active" data-theme="all">全部 / All</button>
        ${themes.map(t => `<button onclick="filterMaterials('${t}')" class="theme-filter-btn" data-theme="${t}">${t}</button>`).join('')}
    `;
    
    if (materials.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"></div><h3>暂无素材</h3><p>添加写作素材帮助学生积累好内容</p></div>';
        return;
    }

    container.innerHTML = materials.map(mat => `
        <div class="card material-card" data-theme="${mat.theme}">
            <div class="card-header">
                <div class="card-title">${escapeHtml(mat.title)}</div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="badge badge-good">${mat.theme.split('/')[0]}</span>
                    ${mat.source === 'auto' ? '<span class="badge badge-excellent">自动收录</span>' : ''}
                </div>
            </div>
            <div class="card-content">${escapeHtml(mat.content)}</div>
            <div class="material-keywords">
                ${mat.keywords.map(k => `<span class="keyword-tag">${escapeHtml(k)}</span>`).join('')}
            </div>
            <div class="card-actions">
                <button onclick="deleteMaterial('${mat.id}')" class="btn btn-danger btn-small">删除</button>
            </div>
        </div>
    `).join('');
}

function filterMaterials(theme) {
    document.querySelectorAll('.theme-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    document.querySelectorAll('.material-card').forEach(card => {
        if (theme === 'all' || card.dataset.theme === theme) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showAddMaterial() {
    document.getElementById('material-form').reset();
    showModal('material-modal');
}

function saveMaterial() {
    const theme = document.getElementById('material-theme').value;
    const title = document.getElementById('material-title').value.trim();
    const content = document.getElementById('material-content').value.trim();
    const keywordsStr = document.getElementById('material-keywords').value.trim();
    
    if (!title || !content) {
        alert('请填写标题和内容');
        return;
    }
    
    const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()) : [];
    
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    materials.push({
        id: 'mat-' + Date.now(),
        theme: theme,
        title: title,
        content: content,
        keywords: keywords,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('materials', JSON.stringify(materials));
    closeModal('material-modal');
    renderMaterialsList();
    alert('素材添加成功！');
}

function deleteMaterial(materialId) {
    if (!confirm('确定要删除这个素材吗？')) return;
    
    let materials = JSON.parse(localStorage.getItem('materials') || '[]');
    materials = materials.filter(m => m.id !== materialId);
    localStorage.setItem('materials', JSON.stringify(materials));
    renderMaterialsList();
}

// Utility Functions
function getTaskById(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return tasks.find(t => t.id === taskId);
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    initializeData();
    initializeMode();
    
    // Add event listener for example task link
    const taskLinkSelect = document.getElementById('example-task-link');
    if (taskLinkSelect) {
        taskLinkSelect.addEventListener('change', updateExampleCriteriaScores);
    }
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showScreen(currentUser.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
        if (currentUser.role === 'teacher') {
            loadTeacherDashboard();
        } else {
            loadStudentDashboard();
        }
    }
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Data Export/Import for Cross-Device Usage
function exportData() {
    const data = {
        tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
        submissions: JSON.parse(localStorage.getItem('submissions') || '[]'),
        examples: JSON.parse(localStorage.getItem('examples') || '[]'),
        materials: JSON.parse(localStorage.getItem('materials') || '[]'),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `gaokao-writing-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('数据导出成功！/ Data exported successfully!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.tasks || !data.submissions) {
                throw new Error('Invalid data format');
            }
            
            if (confirm(`确定要导入数据吗？这将覆盖当前的所有数据。\nImport data? This will overwrite all current data.\n\n任务 / Tasks: ${data.tasks.length}\n提交 / Submissions: ${data.submissions.length}\n范文 / Examples: ${data.examples?.length || 0}\n素材 / Materials: ${data.materials?.length || 0}`)) {
                localStorage.setItem('tasks', JSON.stringify(data.tasks));
                localStorage.setItem('submissions', JSON.stringify(data.submissions));
                if (data.examples) localStorage.setItem('examples', JSON.stringify(data.examples));
                if (data.materials) localStorage.setItem('materials', JSON.stringify(data.materials));
                
                alert('数据导入成功！/ Data imported successfully!');
                location.reload();
            }
        } catch (error) {
            alert('数据导入失败：文件格式错误 / Import failed: Invalid file format');
            console.error(error);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}
