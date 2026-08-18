document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("profileForm");

    const cancelBtn =
        document.getElementById("cancelBtn");

    const feedback =
        document.getElementById("feedback");

    const notificationBtn =
        document.getElementById("notificationBtn");


    const inputs = {

        nome:
            document.getElementById("nome"),

        email:
            document.getElementById("email"),

        telefone:
            document.getElementById("telefone")
    };


    /* =========================================
       VALORES ORIGINAIS
    ========================================= */

    const valoresOriginais = {

        nome:
            inputs.nome.value,

        email:
            inputs.email.value,

        telefone:
            inputs.telefone.value
    };


    /* =========================================
       MENSAGEM
    ========================================= */

    function mostrarMensagem(mensagem) {

        feedback.textContent =
            mensagem;

        clearTimeout(
            mostrarMensagem.timer
        );

        mostrarMensagem.timer =
            setTimeout(() => {

                feedback.textContent =
                    "";

            }, 3000);
    }


    /* =========================================
       SALVAR
    ========================================= */

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (
                !inputs.nome.value.trim() ||
                !inputs.email.value.trim()
            ) {

                mostrarMensagem(
                    "Preencha o nome e o e-mail antes de salvar."
                );

                return;
            }


            mostrarMensagem(
                "Alterações salvas com sucesso!"
            );
        }
    );


    /* =========================================
       CANCELAR
    ========================================= */

    cancelBtn.addEventListener(
        "click",
        () => {

            inputs.nome.value =
                valoresOriginais.nome;

            inputs.email.value =
                valoresOriginais.email;

            inputs.telefone.value =
                valoresOriginais.telefone;


            mostrarMensagem(
                "Alterações canceladas."
            );
        }
    );


    /* =========================================
       NOTIFICAÇÕES
    ========================================= */

    notificationBtn.addEventListener(
        "click",
        () => {

            const count =
                document.querySelector(
                    ".notification-count"
                );


            if (count) {

                count.style.display =
                    "none";
            }


            mostrarMensagem(
                "Você não possui novas notificações."
            );
        }
    );


    /* =========================================
       MÁSCARA DE TELEFONE
    ========================================= */

    inputs.telefone.addEventListener(
        "input",
        (event) => {

            let valor =
                event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 11);


            if (valor.length > 10) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{5})(\d{4}).*/,
                        "($1) $2-$3"
                    );

            } else if (valor.length > 6) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{4})(\d{0,4}).*/,
                        "($1) $2-$3"
                    );

            } else if (valor.length > 2) {

                valor =
                    valor.replace(
                        /^(\d{2})(\d{0,5}).*/,
                        "($1) $2"
                    );
            }


            event.target.value =
                valor;
        }
    );


    /* =========================================
       MENU DESKTOP + MOBILE
    ========================================= */

    document
        .querySelectorAll(
            ".desktop-nav .nav-item, .mobile-nav-item"
        )
        .forEach((item) => {

            item.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();


                    const parent =
                        item.closest("nav");


                    parent
                        ?.querySelectorAll("a")
                        .forEach((link) => {

                            link.classList.remove(
                                "active",
                                "current"
                            );

                        });


                    item.classList.add(
                        "active"
                    );

                    item.classList.add(
                        "current"
                    );
                }
            );

        });

});