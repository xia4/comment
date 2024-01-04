// Todo 
// 1. 댓글 입력
// 1-1. 댓글 입력 폼에 내용을 입력한 뒤 submit을 누르면 리스트에 추가된다.
// 1-2. 입력 폼이 비어있는 상태에서 submit을 누르면 경고 팝업을 띄운다.
// 1-3. 댓글을 성공적으로 처리하면 입력 폼을 reset한다.
// 1-4. 입력한 값을 아이디, 댓글 내용, 날짜 형태로 된 객체로 만들어 리스트에 넣는다.
// 2. 댓글 출력
// 2-1. 댓글 내용은 아이디, 댓글 내용, 날짜로 표현한다.
// 2-2. 댓글 리스트는 최신순으로 나타낸다.
// 2-3. 댓글 총 개수를 표시한다.

const commentBtn = document.querySelector("#commentFrm");
const commentList = document.querySelector("#comment-list");
const total = document.querySelector("h4 > span");
const list = [];
const url = 'http://localhost:5500/my-next-app/server/api/comments.js'

// async function fetchComments() {
//     try {
//         const response = await fetch(url);

//         if (!response.ok) {
//             // If the response status is not OK, handle the error
//             const errorText = await response.text(); // Get the response body as text
//             console.error('댓글 불러오기 실패:', response.status, response.statusText);
//             console.error('Error response body:', errorText);
//             return; // Exit the function early if there's an error
//         }

//         const comments = await response.json();
//         list.push(...comments);
//         totalRecord();
//         drawing();
//     } catch (error) {
//         console.error('댓글 불러오기 중 에러 발생:', error);
//     }
// }

// // 초기 댓글 목록 로딩
// fetchComments();


function loadUserInfo() {
    const userId = localStorage.getItem('userId');
    const userImg = localStorage.getItem('userImg');

    return {userId, userImg};
}
const {userId, userImg} = loadUserInfo() || { userId: 'defaultUser', userImg: 'defaultImage' };;

// 입력한 값을 아이디, 댓글 내용, 날짜 형태로 된 객체로 만들어 리스트에 넣기
function Comment(content) {
    this.userImg = userImg;
    this.userId = userId;
    this.content = content;
    this.date = new Date();
    this.likes = 0;// Initialize likes to 0
}
function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}일 전`;
    } else if (hours > 0) {
        return `${hours}시간 전`;
    } else if (minutes > 0) {
        return `${minutes}분 전`;
    } else {
        return '방금 전';
    }
}

// 사용 예시
const commentDate = new Date(); // 이 부분을 실제 댓글의 작성 시간으로 대체
const timeAgoString = timeAgo(commentDate);

function createRow(userImg, userId, content, date, likes) {
    // createElement 메서드를 이용해 요소를 생성
    const ul = document.createElement("ul")
    const li0 = document.createElement("li")
    const li1 = document.createElement("li")
    const li2 = document.createElement('li')
    const li3 = document.createElement("li")
    const li4 = document.createElement("li")
    // li태그를 ul태그 안에 삽입
    ul.append(li0);
    ul.append(li1);
    ul.append(li2)
    ul.append(li3);

    // setAttribute 메서드를 이용해 class 속성을 부여
    ul.setAttribute("class", "comment-row");
    li0.setAttribute("class", "comment-img");
    li1.setAttribute("class", "comment-info");
    li2.setAttribute("class", "comment-change")
    li3.setAttribute("class", "comment-content");
    li4.setAttribute("class", "comment-date");
    
    // innerHTML을 이용해 요소에 내용 추가
    li0.innerHTML = `<img src="${userImg}" alt="User Image">`;
    // Add comment ID and date to the div
    li1.innerHTML = `<p class="comment-id">${userId}</p> <p class="comment-date">${timeAgo(new Date(date))}</p>`;
    li3.innerHTML = content;
    li4.innerHTML = timeAgo(new Date(date));

    // 메뉴 버튼
    
    const menuButton = document.createElement("button");
    
    menuButton.textContent = "⋮";
    menuButton.setAttribute("class", "menu-button");
    menuButton.addEventListener("click", function(event) {
        openSubMenu(event, ul, content);
    });
    li2.appendChild(menuButton)

    const likeButton = document.createElement("button");

    const currentLikes = Number(likes) || 0;

    likeButton.textContent = `❤ ${currentLikes}`;
    likeButton.setAttribute("class", "like-button");
    likeButton.addEventListener("click", function () {
        likeComment(likeButton, ul, content);
    });
    ul.appendChild(likeButton);
    return ul;
}

function likeComment(likeButton, commentElement, content) {
    const date = new Date().toLocaleDateString();
    const likeKey = `like_${content}_${date}`;
    const hasLiked = localStorage.getItem(likeKey) === 'true';
    const commentIndex = list.findIndex(comment => comment.content === content);
   
    if (hasLiked) {
        // User has already liked, so remove the like and update UI
        removeLike(commentElement, content);
        // Remove the like information from local storage
        localStorage.removeItem(likeKey);

        likeButton.style.color = "black"
    } else {
        // User has not liked, so add the like and update UI
        addLike(commentElement, content);
        // Save information about the user's like to local storage
        localStorage.setItem(likeKey, 'true');

        likeButton.style.color = "red"

        likeButton.classList.add('clicked');

        setTimeout(() => {
            likeButton.classList.remove('clicked');
        },500);
    }

    if (commentIndex !== -1) {
        // Ensure likes is treated as a number and default to 0 if undefined
        const currentLikes = Number(list[commentIndex].likes) || 0;

        // Update the likes property
        list[commentIndex].likes = currentLikes + 0;

        // Update the like button text content
        likeButton.textContent = `❤ ${list[commentIndex].likes}`;
    }
}

function addLike(commentElement, content) {
    const commentIndex = list.findIndex(comment => comment.content === content);
    if (commentIndex !== -1) {
        list[commentIndex].likes += 1;
        updateLikes(commentElement, list[commentIndex].likes);
    }
}

function removeLike(commentElement, content) {
    const commentIndex = list.findIndex(comment => comment.content === content);
    if (commentIndex !== -1 && list[commentIndex].likes > 0) {
        list[commentIndex].likes -= 1;
        updateLikes(commentElement, list[commentIndex].likes);
    }
}

function updateLikes(commentElement, likes) {
    const likeButton = commentElement.querySelector('.like-button');
    likeButton.textContent = `❤ ${likes}`;
}

let subMenuVisible = false;

function openSubMenu(event, commentElement, content) {
    // 서브 메뉴를 담을 div 요소 생성
    const subMenu = document.querySelector(".sub-menu");

    // If sub-menu is visible, hide it
    if (subMenuVisible && subMenu) {
        subMenu.remove();
        subMenuVisible = false;
        return;
    }

    // Create sub-menu if it doesn't exist
    const newSubMenu = document.createElement("div");
    newSubMenu.setAttribute("class", "sub-menu");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
        editComment(commentElement, content);
        newSubMenu.remove();
        subMenuVisible = false;
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
        deleteComment(commentElement, content);
        newSubMenu.remove();
        subMenuVisible = false;
    });

    newSubMenu.appendChild(editButton);
    newSubMenu.appendChild(deleteButton);

    const rect = event.target.getBoundingClientRect();
    newSubMenu.style.position = "absolute";
    newSubMenu.style.top = rect.bottom + "px";
    newSubMenu.style.left = rect.left + "px";

    document.body.appendChild(newSubMenu);

    event.stopPropagation();

    // Update sub-menu visibility state
    subMenuVisible = true;

    document.addEventListener("click", function closeSubMenu() {
        newSubMenu.remove();
        subMenuVisible = false;
        document.removeEventListener("click", closeSubMenu);
    });
}

function editComment(commentElement, content) {
    // 댓글 요소 내에서 내용과 메뉴 버튼
    const contentElement = commentElement.querySelector('.comment-content');
    const menuButton = commentElement.querySelector('.menu-button');

    // 편집용 textarea를 생성
    const editInput = document.createElement("textarea");
    editInput.rows = 1; // textarea의 행 수를 설정
    editInput.spellcheck = false; // textarea의 스펠 체크 비활성화
    editInput.value = content; // 초기 값을 현재 댓글 내용으로 설정

    // blur 이벤트에 대한 리스너를 추가
    editInput.addEventListener("blur", function () {
        saveEditedComment(commentElement, editInput);
    });

    // 기존 내용을 지우고 contentElement에 textarea를 추가
    contentElement.innerHTML = '';  
    contentElement.appendChild(editInput);

    // 수정할 때 메뉴 버튼을 숨김
    menuButton.style.display = "none";
}

function saveEditedComment(commentElement, editInput) {
    const editedContent = editInput.value;

    const contentElement = commentElement.querySelector('.comment-content');
    const menuButton = commentElement.querySelector('.menu-button');

    // 수정된 내용으로 갱신
    contentElement.textContent = editedContent;

    // 기존 내용 보이기
    menuButton.style.display = "inline";
}

function deleteComment(commentElement, content) {
    const commentIndex = list.findIndex(comment => comment.content === content);
    if (commentIndex !== -1) {
        list.splice(commentIndex, 1);
        alert('삭제 하시겠습니까?')
    }
    commentElement.remove();
    totalRecord();
}

// 댓글 내용은 아이디, 댓글 내용, 날짜로 출력
function drawing() {
    commentList.innerHTML = "";
    // 댓글 리스트는 for문을 역순으로 돌려 최신순으로 나타낸다.
    for (let i = list.length -1; i >= 0; i--) {
        const row = createRow(list[i].userImg, list[i].userId, list[i].content, list[i].date);
        commentList.append(row);
    }
}

// 댓글 총개수를 출력
function totalRecord() {
    total.innerHTML = `(${list.length})`;
}
// 댓글 입력폼에 내용을 입력한 뒤 submit을 누르면 리스트에 추가
async function commentBtnHandler(e) {
    // submit버튼의 기본 동작을 막아준다.
    e.preventDefault()
    const input = e.target.content;
    // 입력폼이 비어있는 상태에서 submit을 누르면 경고 팝업 띄우기
    if(input.value === "") {
        alert("댓글 작성 후 등록 버튼을 눌러주세요.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: input.value }),
        });
    
        if (response.ok) {
        // 성공적인 응답 처리
            const commentObj = new Comment(input.value);
          list.push(commentObj);
          totalRecord();
          drawing();
          e.target.reset();
        } else {
          alert('댓글 전송에 실패했습니다.');
        }
      } catch (error) {
        console.error('댓글 전송 중 에러 발생:', error);
        alert('댓글 전송 중 에러가 발생했습니다.');
    }
    // submit을 누르면 작성한 댓글이 들어간 객체를 생성해 리스트에 추가
    // const commentObj = new Comment(input.value)
    // list.push(commentObj)

    // 댓글을 작성할 때마다 총개수가 갱신 된다.
    // totalRecord();

    // 댓글을 쓸때마다 아래에 입력한 내용이 출력된다.
    // drawing();
    // 댓글을 성공적으로 처리하면 입력폼을 reset
    // e.target.reset();
}

totalRecord()

commentBtn.addEventListener("submit", commentBtnHandler, function(e) {
    // 폼 기본 제출 동작 방지
    e.preventDefault()
})

