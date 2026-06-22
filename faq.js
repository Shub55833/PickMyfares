const questions = document.querySelectorAll(".faq-question");

questions.forEach((q) => {
  q.addEventListener("click", () => {
    const answer = q.nextElementSibling;

    // close all (optional - ek hi open hoga)
    document.querySelectorAll(".faq-answer").forEach((a) => {
      if (a !== answer) a.style.display = "none";
    });

    // toggle current
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});
