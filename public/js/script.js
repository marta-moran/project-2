document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project-2-testing JS imported successfully!");
    getbtns()
    document.getElementById('check').addEventListener('click', getPhrase)
  },
  false
);

function getbtns() {
  const otrodiv = document.querySelector('.result')
  const btns = document.querySelectorAll('.word')
  console.log(btns)
  for (let btn of btns) {

    btn.addEventListener('click', () => {
      const paragraph = document.createElement('span')
      paragraph.setAttribute('class', 'btn-translate') //
      paragraph.textContent = btn.textContent
      otrodiv.appendChild(paragraph)
      btn.remove()
      getLastParagraphs()
    })
  }
}

function getLastBtns() {
  const otrodiv = document.querySelector('.result')
  const btns = document.querySelectorAll('.word')
  console.log(btns)
  const lastBtn = btns[btns.length - 1];
  lastBtn.addEventListener('click', () => {
    const paragraph = document.createElement('span')
    paragraph.setAttribute('class', 'btn-translate')
    paragraph.textContent = lastBtn.textContent
    otrodiv.appendChild(paragraph)
    lastBtn.remove()
    getLastParagraphs()
  })

}

function getLastParagraphs() {
  const divBtn = document.querySelector('#btn-div')
  const ps = document.querySelectorAll('span')
  console.log(ps)
  const lastP = ps[ps.length - 1];
  lastP.addEventListener('click', () => {
    const btn = document.createElement('button')
    btn.setAttribute('class', 'word btn-frase')
    btn.textContent = lastP.textContent
    divBtn.appendChild(btn)
    lastP.remove()
    console.log("GET BTNS")
    getLastBtns()
  })
}


async function getPhrase() {
  try {
    let ps = document.querySelectorAll('#phrase span')
    const phrase = []
    for (let p of ps) {
      phrase.push(p.textContent)
    }

    const res = await axios.get('http://localhost:3000/series/getphrase')

    console.log(res.data.phrase)
    // destructurar
    const { phrase: enPhrase, words: esPhrase, id, userId } = res.data;
    // const enPhrase = res.data.phrase
    // const esPhrase = res.data.words
    // const id = res.data.id
    // const userId = res.data.userId

    console.log(checkPhrase(phrase, esPhrase))

    if (checkPhrase(phrase, esPhrase)) {
      const points = phrase.length
      const res = await axios.post(`http://localhost:3000/users/${userId}/points`, { points })
      console.log("res--->", res)
      window.location.href = `http://localhost:3000/series/${id}/translate`
    } else {
      const divErr = document.createElement('div')
      const p = document.createElement('p')
      p.textContent = 'has fallaoooo'
      p.setAttribute('id', 'errorMessage')
      divErr.appendChild(p)
      document.body.appendChild(divErr)
    }

  } catch (err) {
    console.log(err)
  }

}


function checkPhrase(phrase, ogPhrase) {
  const phrase1 = phrase.join(" ");
  const phrase2 = ogPhrase.join(" ");
  console.log(phrase1, phrase2);
  return phrase1 === phrase2


}
