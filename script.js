(function () {
  'use strict';

  // =========================
  // FUNÇÕES BÁSICAS
  // =========================

  function byId(id) {
    return document.getElementById(id);
  }

  function all(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function pageName() {
    var path = window.location.pathname;
    var file = path.split('/').pop();

    return file || 'login.html';
  }

  function fromPage() {
    var params = new URLSearchParams(window.location.search);
    return params.get('from') || 'dashboard.html';
  }

  function navigate(target) {
    if (!target) return;
    window.location.href = target;
  }

  // =========================
  // TOAST / AVISOS
  // =========================

  function showToast(message, type) {
    var region = byId('toast-region');

    if (!region) {
      region = document.createElement('div');
      region.id = 'toast-region';
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }

    var toast = document.createElement('div');

    toast.className = 'toast' + (type ? ' ' + type : '');
    toast.textContent = message;

    region.appendChild(toast);

    setTimeout(function () {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3400);
  }

  function currentPathForBack() {
    return encodeURIComponent(pageName());
  }

  // =========================
  // NAVEGAÇÃO
  // =========================

  function bindNavigation() {

    // Botões com data-page
    all('[data-page]:not(body)').forEach(function (button) {

      button.addEventListener('click', function (event) {
        event.preventDefault();

        var target = button.getAttribute('data-page');

        if (target) {
          navigate(target);
        }
      });

    });


    // Abrir popup "Olho"
    all('[data-open-project]').forEach(function (button) {

      button.addEventListener('click', function (event) {
        event.preventDefault();

        navigate(
          'popupolho.html?from=' + currentPathForBack()
        );
      });

    });


    // Abrir popup "Trabalhos Orientados"
    all('[data-open-notes]').forEach(function (button) {

      button.addEventListener('click', function (event) {
        event.preventDefault();

        navigate(
          'popuptrabalhos.html?from=' + currentPathForBack()
        );
      });

    });


    // Voltar
    all('[data-back]').forEach(function (button) {

      button.addEventListener('click', function (event) {
        event.preventDefault();

        navigate(fromPage());
      });

    });


    // Links normais com data-href
    all('[data-href]').forEach(function (element) {

      element.addEventListener('click', function (event) {
        event.preventDefault();

        var target = element.getAttribute('data-href');

        if (target) {
          navigate(target);
        }

      });

    });
  }

  // =========================
  // LOGIN
  // =========================

  function bindLogin() {

    var form = byId('login-form');

    if (!form) return;


    // Mostrar / esconder senha
    var password = byId('password');
    var toggle = byId('toggle-password');

    if (toggle && password) {

      toggle.addEventListener('click', function (event) {
        event.preventDefault();

        var visible = password.type === 'text';

        password.type = visible ? 'password' : 'text';

        toggle.setAttribute(
          'aria-label',
          visible ? 'Mostrar senha' : 'Ocultar senha'
        );

        toggle.innerHTML = visible
          ? icon('eye')
          : icon('eye-off');
      });

    }


    // Login
    form.addEventListener('submit', function (event) {

      event.preventDefault();

      // Redireciona para o dashboard
      navigate('dashboard.html');

    });


    // Botão voltar
    var returnButton = byId('login-return');

    if (returnButton) {

      returnButton.addEventListener('click', function (event) {
        event.preventDefault();

        navigate('login.html');
      });

    }
  }

  // =========================
  // DASHBOARD / PROJETOS
  // =========================

  function bindDashboardAndProjects() {

    all('[data-notification]').forEach(function (button) {

      button.addEventListener('click', function (event) {

        event.preventDefault();

        var message =
          button.getAttribute('data-notification') ||
          'Você não possui novos avisos.';

        showToast(message);

      });

    });
  }

  // =========================
  // PERFIL
  // =========================

  function bindProfile() {

    var form = byId('profile-form');

    if (!form) return;

    var initial = {};

    all('input[data-profile-field]', form).forEach(function (input) {
      initial[input.name] = input.value;
    });


    form.addEventListener('submit', function (event) {

      event.preventDefault();

      showToast(
        'Alterações salvas com sucesso.',
        'success'
      );

    });


    var cancel = byId('cancel-profile');

    if (cancel) {

      cancel.addEventListener('click', function (event) {

        event.preventDefault();

        all(
          'input[data-profile-field]',
          form
        ).forEach(function (input) {

          if (Object.prototype.hasOwnProperty.call(initial, input.name)) {
            input.value = initial[input.name];
          }

        });

        showToast('Alterações canceladas.');

      });

    }
  }

  // =========================
  // NOTAS / AVALIAÇÃO
  // =========================

  function normalizeScore(value) {

    var parsed = parseFloat(
      String(value).replace(',', '.')
    );

    if (isNaN(parsed)) {
      return null;
    }

    parsed = Math.max(
      0,
      Math.min(10, parsed)
    );

    return Math.round(parsed * 2) / 2;
  }


  function formatScore(value) {

    var number = Number(value);

    if (number % 1 === 0) {
      return String(number);
    }

    return number
      .toFixed(1)
      .replace('.', ',');
  }


  function bindEvaluation() {

    var criteria = all('[data-criterion]');

    if (!criteria.length) return;


    criteria.forEach(function (criterion) {

      var range =
        criterion.querySelector('.score-range');

      var numberInput =
        criterion.querySelector('.score-input');

      var scoreLabel =
        criterion.querySelector('[data-score-label]');


      if (!range || !numberInput) {
        return;
      }


      function updateRange(value) {

        range.value = value;

        range.style.setProperty(
          '--progress',
          (Number(value) * 10) + '%'
        );

        if (scoreLabel) {

          scoreLabel.textContent =
            formatScore(value) + ' / 10';

        }
      }


      updateRange(range.value);


      // Slider
      range.addEventListener('input', function () {

        numberInput.value = range.value;

        updateRange(range.value);

      });


      // Campo numérico
      numberInput.addEventListener('input', function () {

        var score =
          normalizeScore(numberInput.value);

        if (score !== null) {
          updateRange(score);
        }

      });


      numberInput.addEventListener('change', function () {

        var score =
          normalizeScore(numberInput.value);

        if (score === null) {
          score = 0;
        }

        numberInput.value = score;

        updateRange(score);

      });

    });


    // Salvar avaliação
    var save = byId('save-evaluation');

    if (save) {

      save.addEventListener('click', function (event) {

        event.preventDefault();

        var invalid =
          all('.score-input').some(function (input) {

            return normalizeScore(input.value) === null;

          });


        if (invalid) {

          showToast(
            'Revise as notas antes de salvar.'
          );

          return;
        }


        var time =
          new Date().toLocaleTimeString(
            'pt-BR',
            {
              hour: '2-digit',
              minute: '2-digit'
            }
          );


        showToast(
          'Avaliação salva às ' + time + '.',
          'success'
        );

      });

    }


    // Focar avaliação
    var focusButton =
      byId('focus-evaluation');

    var firstRange =
      document.querySelector('.score-range');


    if (focusButton && firstRange) {

      focusButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();

          var section =
            byId('evaluation-form');

          if (section) {

            section.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

          }

          setTimeout(function () {
            firstRange.focus();
          }, 350);

        }
      );

    }


    // Contador de caracteres
    var summary =
      byId('general-summary');

    var counter =
      byId('character-count');


    if (summary && counter) {

      function updateCounter() {

        counter.textContent =
          summary.value.length + ' / 800';

      }

      summary.addEventListener(
        'input',
        updateCounter
      );

      updateCounter();

    }
  }

  // =========================
  // POPUPS
  // =========================

  function bindPopup() {

    var popup =
      document.body.getAttribute('data-popup');

    if (!popup) return;


    // Fechar popup
    all('[data-close-popup]').forEach(function (button) {

      button.addEventListener('click', function (event) {

        event.preventDefault();

        navigate(fromPage());

      });

    });


    // ESC para fechar
    document.addEventListener('keydown', function (event) {

      if (event.key === 'Escape') {

        navigate(fromPage());

      }

    });
  }

  // =========================
  // ÍCONES
  // =========================

  function icon(name) {

    var paths = {

      eye:
        '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">' +
        '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path>' +
        '<circle cx="12" cy="12" r="2.5"></circle>' +
        '</svg>',

      'eye-off':
        '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">' +
        '<path d="m3 3 18 18"></path>' +
        '<path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a18.8 18.8 0 0 1-3.2 3.7"></path>' +
        '<path d="M6.2 6.9C3.5 8.5 2 12 2 12s3.5 6 10 6a10.8 10.8 0 0 0 3.1-.5"></path>' +
        '</svg>'

    };

    return paths[name] || '';
  }

  // =========================
  // INICIALIZAÇÃO
  // =========================

  document.addEventListener(
    'DOMContentLoaded',
    function () {

      bindNavigation();
      bindLogin();
      bindDashboardAndProjects();
      bindProfile();
      bindEvaluation();
      bindPopup();

    }
  );

})();