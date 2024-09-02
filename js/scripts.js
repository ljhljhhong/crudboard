document.addEventListener('DOMContentLoaded', () => {
    const newPostButton = document.getElementById('newPostButton');
    const closeButton = document.querySelector('.close-button');
    const form = document.getElementById('form');
    const postIdField = document.getElementById('postId');
    const postTitleField = document.getElementById('postTitle');
    const postAuthorField = document.getElementById('postAuthor');
    const postContentField = document.getElementById('postContent');
    const postDetail = document.getElementById('postDetail');
    const postDetailTitle = document.getElementById('postDetailTitle');
    const postDetailAuthor = document.getElementById('postDetailAuthor');
    const postDetailDate = document.getElementById('postDetailDate');
    const postDetailContent = document.getElementById('postDetailContent');
    const commentsSection = document.getElementById('commentsSection');
    const commentsList = document.getElementById('commentsList');
    const commentAuthorField = document.getElementById('commentAuthor');
    const commentContentField = document.getElementById('commentContent');
    const addCommentButton = document.getElementById('addCommentButton');
    const deletePostButton = document.getElementById('deletePostButton');
    const deleteSelectedButton = document.getElementById('deleteSelectedButton');
    const postForm = document.getElementById('postForm');
    const postList = document.getElementById('postList');
    
    let posts = [];
    let comments = {};
    let currentPostId = null;
    let currentCommentIndex = null;
    let isPostDetailVisible = false; // 게시글 내용의 표시 상태를 추적

    newPostButton.addEventListener('click', () => {
        openForm();
    });

    closeButton.addEventListener('click', () => {
        closeForm();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        savePost();
        closeForm();
    });

    addCommentButton.addEventListener('click', () => {
        if (currentCommentIndex !== null) {
            updateComment();
        } else {
            addComment();
        }
    });

    deletePostButton.addEventListener('click', () => {
        deletePost();
    });

    deleteSelectedButton.addEventListener('click', () => {
        deleteSelectedPosts();
    });

    function openForm(postId = null) {
        if (postId) {
            const post = posts.find(p => p.id === postId);
            postIdField.value = post.id;
            postTitleField.value = post.title;
            postAuthorField.value = post.author;
            postContentField.value = post.content;
        } else {
            form.reset();
            postIdField.value = '';
        }
        postForm.style.display = 'block';
    }

    function closeForm() {
        postForm.style.display = 'none';
    }

    function savePost() {
        const postId = postIdField.value;
        const postTitle = postTitleField.value;
        const postAuthor = postAuthorField.value;
        const postContent = postContentField.value;

        if (postId) {
            const post = posts.find(p => p.id === postId);
            post.title = postTitle;
            post.author = postAuthor;
            post.content = postContent;
        } else {
            const newPost = {
                id: Date.now().toString(),
                title: postTitle,
                author: postAuthor,
                content: postContent,
                date: new Date().toLocaleString()
            };
            posts.push(newPost);
            comments[newPost.id] = [];
        }
        renderPosts();
    }

    function renderPosts() {
        postList.innerHTML = '';
        posts.forEach((post, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="post-checkbox" data-id="${post.id}"></td>
                <td>${index + 1}</td>
                <td>${post.title}</td>
                <td>${post.author}</td>
                <td>${post.date}</td>
                <td><button onclick="editPost('${post.id}')">수정</button></td>
            `;
            row.addEventListener('click', () => {
                togglePostDetail(post.id);
            });
            postList.appendChild(row);
        });
    }

    function editPost(postId) {
        openForm(postId);
    }

    function togglePostDetail(postId) {
        if (currentPostId === postId && isPostDetailVisible) {
            // 현재 게시글이 이미 열려 있고 다시 클릭한 경우
            postDetail.style.display = 'none';
            commentsSection.style.display = 'none';
            isPostDetailVisible = false;
            currentPostId = null;
        } else {
            // 게시글을 새로 클릭하거나 다른 게시글을 클릭한 경우
            showPostDetail(postId);
            isPostDetailVisible = true;
        }
    }

    function showPostDetail(postId) {
        const post = posts.find(p => p.id === postId);
        postDetailTitle.innerText = post.title;
        postDetailAuthor.innerText = post.author;
        postDetailDate.innerText = post.date;
        postDetailContent.innerText = post.content;
        postDetail.style.display = 'block';

        showComments(postId);
        currentPostId = postId;
    }

    function showComments(postId) {
        commentsSection.style.display = 'block';
        commentsList.innerHTML = '';
        const postComments = comments[postId] || [];
        postComments.forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <div class="comment-author">${comment.author}</div>
                <div class="comment-content">${comment.content}</div>
                <button onclick="editComment('${postId}', ${index})">수정</button>
                <button onclick="deleteComment('${postId}', ${index})">삭제</button>
            `;
            commentsList.appendChild(commentDiv);
        });
    }

    function addComment() {
        if (!currentPostId) {
            alert('먼저 게시글을 선택하세요.');
            return;
        }

        const commentAuthor = commentAuthorField.value;
        const commentContent = commentContentField.value;

        const newComment = {
            author: commentAuthor,
            content: commentContent,
            date: new Date().toLocaleString()
        };

        if (!comments[currentPostId]) {
            comments[currentPostId] = [];
        }

        comments[currentPostId].push(newComment);
        showComments(currentPostId);
        commentAuthorField.value = '';
        commentContentField.value = '';
    }

    function updateComment() {
        if (currentPostId === null || currentCommentIndex === null) {
            alert('수정할 댓글을 선택하세요.');
            return;
        }

        const commentAuthor = commentAuthorField.value;
        const commentContent = commentContentField.value;

        comments[currentPostId][currentCommentIndex] = {
            author: commentAuthor,
            content: commentContent,
            date: new Date().toLocaleString()
        };

        showComments(currentPostId);
        commentAuthorField.value = '';
        commentContentField.value = '';
        currentCommentIndex = null;
        addCommentButton.textContent = '댓글 추가';
        addCommentButton.onclick = () => {
            addComment();
        };
    }

    function deleteComment(postId, commentIndex) {
        comments[postId].splice(commentIndex, 1);
        showComments(postId);
    }

    function deletePost() {
        if (currentPostId) {
            posts = posts.filter(p => p.id !== currentPostId);
            delete comments[currentPostId];
            renderPosts();
            postDetail.style.display = 'none';
            commentsSection.style.display = 'none';
            isPostDetailVisible = false;
            currentPostId = null;
        } else {
            alert('삭제할 게시글을 선택하세요.');
        }
    }

    function deleteSelectedPosts() {
        const selectedCheckboxes = document.querySelectorAll('.post-checkbox:checked');
        const idsToDelete = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);

        // 필터링을 통해 선택되지 않은 게시글만 남김
        posts = posts.filter(post => !idsToDelete.includes(post.id));
        idsToDelete.forEach(id => delete comments[id]);

        renderPosts();
        postDetail.style.display = 'none';
        commentsSection.style.display = 'none';
        isPostDetailVisible = false;
        currentPostId = null;
    }

    window.editComment = (postId, commentIndex) => {
        const comment = comments[postId][commentIndex];
        commentAuthorField.value = comment.author;
        commentContentField.value = comment.content;

        addCommentButton.textContent = '댓글 수정';
        addCommentButton.onclick = () => {
            updateComment();
        };

        currentPostId = postId;
        currentCommentIndex = commentIndex;
    };

    window.deleteComment = (postId, commentIndex) => {
        comments[postId].splice(commentIndex, 1);
        showComments(postId);
    };

    // 초기 데이터 렌더링
    renderPosts();
});
