// ボタン要素と入力フォーム要素を取得
const showFormButton = document.getElementById("showFormButton-<%= post.id %>");
const inputForm = document.getElementById("inputForm-<%= post.id %>");

// 返信ボタンがクリックされたときの処理
showFormButton.addEventListener("click", () => {
  // 入力フォームを表示
  inputForm.style.display = "block";
});
