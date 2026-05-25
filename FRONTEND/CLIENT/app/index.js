// Переключение разделов
const createSection = document.getElementById("createSection");
const statusSection = document.getElementById("statusSection");
const showCreateBtn = document.getElementById("showCreateFormBtn");
const showStatusBtn = document.getElementById("showStatusFormBtn");

const API_BASE = import.meta.env.VITE_API_BASE || "http://192.168.0.101:3001";

showCreateBtn.addEventListener("click", () => {
  createSection.style.display = "block";
  statusSection.style.display = "none";
});
showStatusBtn.addEventListener("click", () => {
  createSection.style.display = "none";
  statusSection.style.display = "block";
  // очищаем старый результат при переключении
  document.getElementById("statusResult").innerHTML = "";
});

// ------- Обработчик создания заявки -------
const appForm = document.getElementById("applicationForm");
const createResult = document.getElementById("createResult");
const modelSelect = appForm.querySelector('select[name="carModel"]');

const GAZ_MODELS = [
  "ГАЗель NEXT",
  "ГАЗель NN",
  "Соболь NN",
  "Соболь 4x4",
  "Валдай NEXT",
  "ГАЗон NEXT",
  "Садко NEXT",
];

if (modelSelect) {
  GAZ_MODELS.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
}
// Переключение фонов
const bgThemes = [
  "", // исходный (radial-gradient)
  "bg-light",
  "bg-blue-dynamic",
  "bg-carbon",
  "bg-sunset",
  "bg-glass",
];
let currentBgIndex = 0;

const bgButton = document.getElementById("bgToggleBtn");
if (bgButton) {
  bgButton.addEventListener("click", () => {
    // Удаляем все классы тем
    bgThemes.forEach((theme) => {
      if (theme) document.body.classList.remove(theme);
    });
    // Переключаем индекс
    currentBgIndex = (currentBgIndex + 1) % bgThemes.length;
    const newTheme = bgThemes[currentBgIndex];
    if (newTheme) {
      document.body.classList.add(newTheme);
    } else {
      // Возвращаем базовый фон (удаляем все темы, оставляем дефолтный)
      document.body.style.background = ""; // сброс инлайна, если был
    }
  });
}
appForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(appForm);
  const photoInput = appForm.querySelector('input[name="photos"]');

  if (photoInput.files.length > 3) {
    createResult.innerHTML = "Можно прикрепить не более 3 файлов";
    return;
  }

  // Очистка и пересборка photos в FormData
  formData.delete("photos");
  for (const file of photoInput.files) {
    formData.append("photos", file);
  }

  createResult.innerHTML = "Отправка...";

  try {
    const response = await fetch(`${API_BASE}/api/client/application`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Ошибка ${response.status}`);
    }

    // Тот самый простой ответ без стилей
    createResult.innerHTML = "Заявка успешно создана!";
    appForm.reset();
  } catch (err) {
    createResult.innerHTML = `Ошибка: ${err.message}`;
  }
});

// ------- Обработчик проверки статуса -------
const statusForm = document.getElementById("statusForm");
const statusResult = document.getElementById("statusResult");

statusForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const plate = document.getElementById("statusPlate").value.trim();
  if (!plate) return;

  statusResult.innerHTML = "Поиск...";
  try {
    const response = await fetch(
      `${API_BASE}/api/client/status/${encodeURIComponent(plate)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Заявка не найдена (${response.status})`);
    }

    // Отображаем статус и сообщение
    const statusText =
      {
        WAITING: "Ожидает обработки",
        ACCEPTED: "Принята в работу",
        READY: "Готова к выдаче",
      }[data.status] || data.status;

    const rawPhotos = data.photos || [];

    const photosArray = [rawPhotos].flat().flatMap((item) => {
      try {
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : item;
      } catch (e) {
        return item;
      }
    });

    statusResult.innerHTML = `
        <p><strong>Госномер:</strong> ${plate}</p>
        <p><strong>Статус:</strong> ${statusText}</p>
        ${data.message ? `<p><strong>Сообщение:</strong> ${data.message}</p>` : ""}

        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
            ${
              photosArray.length > 0
                ? photosArray
                    .map(
                      (path) => `
                    <img src="${API_BASE}${path}"
                        style="width: 200px; border-radius: 8px;"
                        alt="Фото">`,
                    )
                    .join("")
                : "<p>Фотографий нет</p>"
            }
        </div>
`;
  } catch (err) {
    statusResult.innerHTML = `<p style="color: red;">Ошибка: ${err.message}</p>`;
  }
});

const questionSection = document.getElementById("questionSection");
const showQuestionBtn = document.getElementById("showQuestionFormBtn");
const questionForm = document.getElementById("questionForm");
const questionResult = document.getElementById("questionResult");

// Обновляем логику переключения (добавляем скрытие/показ нового раздела)
showCreateBtn.addEventListener("click", () => {
  createSection.style.display = "block";
  statusSection.style.display = "none";
  questionSection.style.display = "none";
});

showStatusBtn.addEventListener("click", () => {
  createSection.style.display = "none";
  statusSection.style.display = "block";
  questionSection.style.display = "none";
  document.getElementById("statusResult").innerHTML = "";
});

// Обработчик для кнопки "Задать вопрос"
showQuestionBtn.addEventListener("click", () => {
  createSection.style.display = "none";
  statusSection.style.display = "none";
  questionSection.style.display = "block";
  questionResult.innerHTML = "";
});

// ------- Обработчик отправки вопроса -------
questionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(questionForm);
  // Преобразуем FormData в обычный объект для отправки JSON
  const data = Object.fromEntries(formData.entries());

  questionResult.innerHTML = "Отправка вопроса...";

  try {
    const response = await fetch(`${API_BASE}/api/client/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Ошибка ${response.status}`);
    }

    questionResult.innerHTML =
      "Ваш вопрос успешно отправлен! Мы свяжемся с вами в ближайшее время.";
    questionForm.reset();
  } catch (err) {
    questionResult.innerHTML = `Ошибка: ${err.message}`;
  }
});
