## Описание

Тестовое задание по обучению - Чат
Четвертая итерация по проекту
В приложении есть страницы - с чатами, с аторизацией, с регистрацией, с редактированеим профиля;
Использован бэкенд https://ya-praktikum.tech/api/v2/swagger/


## Команды

- `npm start` сборка и запуск
- `npm dev` запуск версии для разработчика
- `npm build` запуск сборки
- `npm lint:stylelint` запуск stylelint
- `npm lint:eslint` запуск eslint
- `npm lint:eslint-write` запуск eslint с --fix
- `test` запуск тестов

## Ссылки

- Ссылка на код проекта [Github] (https://github.com/mar-mar/middle.messenger.praktikum.yandex)
- Ссылка на дизайн-макет [Figma] (https://www.figma.com/file/zUKWEeDcz43Z8id9ZpWPkZ/Chat-(Copy)?node-id=1%3A2&t=6OaFZJjHnE1IELdn-0)
- Проект развернут на [Netlify] (https://magical-baklava-3facb3.netlify.app)

- yandex cloud https://bba567sef34nnrnhaig6.containers.yandexcloud.net/

## Инструменты
- Сборщик webpack
- Шаблонизатор - handlebars
- Стили - postcss
- husky для pre-commit
- eslint 
- stylelint
- для тестов mocha (ts-node/register, chai, sinon)
- docker

<details>

удадить husky и хуки

`npm uninstall husky && git config --unset core.hooksPath`

docker
```
docker build -t chat-app:dev -f Dockerfile .
docker run -p 3000:3000 -it chat-app:dev
cntl-p+cntl-q

docker container ps
docker stop <CONTAINER ID>
```

</details>
