;(function () {
  getPost()
  let id = ''
  // 게시글 등록 시
  document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = e.target.title.value
    const name = e.target.name.value
    const password = e.target.password.value
    const content = e.target.content.value

    if (!title) {
      return alert('제목을 입력하세요')
    }
    if (!name) {
      return alert('이름을 입력하세요')
    }
    if (!password) {
      return alert('비밀번호를 입력하세요')
    }
    if (!content) {
      return alert('내용을 입력하세요')
    }
    try {
      await axios.post('/posts', { title, name, password, content })
    } catch (err) {
      console.error(err)
    }
    location.reload()
  })

  // 게시글 조회
  async function getPost() {
    try {
      const res = await axios.get('/posts')
      const posts = res.data
      posts.forEach((post, idx) => {
        let postView = `
          <tr class="post-id" data-documentId=${post._id}>
          <td>${post.title}</td>
          <td>${post.name}</td>
          <td>${post.content}</td>
          <td>${post.createdAt}</td>
          <td><button class="editPost">수정</button></td>
          <td><button class="deletePost">삭제</button></td>
          </tr>
          `
        document
          .querySelector('#post-list-body')
          .insertAdjacentHTML('beforeend', postView)

        // 수정
        document
          .querySelectorAll('.editPost')
          [idx].addEventListener('click', async () => {
            // 수정 클릭 시
            alert('안녕')
            const newPost = prompt('바꿀 내용을 입력하세요')
            if (!newPost) {
              return alert('내용을 반드시 입력하셔야 합니다')
            }
            try {
              await axios.put(`/posts/${post._id}`, { content: newPost })
            } catch (err) {
              console.error(err)
            }
            location.reload()
          })

        // 삭제
        document
          .querySelectorAll('.deletePost')
          [idx].addEventListener('click', async () => {
            // 삭제 클릭 시
            try {
              await axios.delete(`/posts/${post._id}`)
            } catch (err) {
              console.error(err)
            }
            location.reload()
          })

        // 게시글 눌렀을 때 댓글 로딩
        document
          .querySelectorAll('.post-id')
          [idx].addEventListener('click', function () {
            id = this.dataset.documentid
            document.querySelector('#post-id').value = id
            getComment(id)
          })
      })
    } catch (err) {
      console.error(err)
    }
  }

  // 댓글 로딩
  async function getComment(id) {
    document.querySelector('#comment-list-body').innerHTML = ''

    try {
      const res = await axios.get(`/posts/${id}/comments`)
      const comments = res.data
      comments.forEach((comment, idx) => {
        let commentView = `
        <tr class="post-id" data-documentId=${comment._id}>
        <td>${comment.commenterName}</td>
        <td>${comment.comment}</td>
        <td>${comment.createdAt}</td>
        <td><button class="editComment">수정</button></td>
        <td><button class="deleteComment">삭제</button></td>
        </tr>
        `
        document
          .querySelector('#comment-list-body')
          .insertAdjacentHTML('beforeend', commentView)

        // 수정
        document
          .querySelectorAll('.editComment')
          [idx].addEventListener('click', async () => {
            // 수정 클릭 시
            const newComment = prompt('바꿀 내용을 입력하세요')
            if (!newComment) {
              return alert('내용을 반드시 입력하셔야 합니다')
            }
            try {
              await axios.put(`/comments/${comment._id}`, {
                comment: newComment,
              })
            } catch (err) {
              console.error(err)
            }
            getComment(id)
          })

        // 삭제
        document
          .querySelectorAll('.deleteComment')
          [idx].addEventListener('click', async () => {
            // 삭제 클릭 시
            try {
              await axios.delete(`/comments/${comment._id}`)
            } catch (err) {
              console.error(err)
            }
            getComment(id)
          })
      })
    } catch (err) {
      console.error(err)
    }
  }

  // 댓글 등록 시
  document
    .getElementById('comment-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault()
      document.querySelector('#post-id').innerText = id
      const postId = id
      const commenterName = e.target.commenterName.value
      const comment = e.target.comment.value
      if (!commenterName) {
        return alert('아이디를 입력하세요')
      }
      if (!comment) {
        return alert('댓글을 입력하세요')
      }
      try {
        await axios.post('/comments', { postId, commenterName, comment })
      } catch (err) {
        console.error(err)
      }
      e.target.commenterName.value = ''
      e.target.comment.value = ''
      document.querySelector('#post-id').value = ''
    })
})()
