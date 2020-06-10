const commentContainers = [...document.querySelectorAll('.media-body')];

if (commentContainers.length > 0) {
    commentContainers.forEach(container => {
        const childrenArray = [...container.children];
        const toggle = childrenArray.find(el => el.classList.contains('toggleEditCommentBox'));
        const editBox = childrenArray.find(el => el.classList.contains('editCommentBox'));
        
        if (toggle) {
            toggle.addEventListener('click', e => {
                e.preventDefault();
                editBox.classList.toggle('d-none');
            });
        }
    });
}