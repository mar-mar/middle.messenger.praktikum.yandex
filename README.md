## Описание

Тестовое задание по обучению - Чат
Третья итерация по проекту, проект находится в работе:
добавлены страницы - с чатами, с аторизацией, с регистрацией, с редактированеим профиля;
добавлены модальные окона и popup-меню
подключен бэкенд и история страниц



## Установка

- `npm start` сборка и запуск
- `npm dev` запуск версии для разработчика
- `npm build` запуск сборки
- `npm link` запуск stylelint

## Ссылки

- Ссылка на код проекта [Github] (https://github.com/mar-mar/middle.messenger.praktikum.yandex)
- Ссылка на дизайн-макет [Figma] (https://www.figma.com/file/zUKWEeDcz43Z8id9ZpWPkZ/Chat-(Copy)?node-id=1%3A2&t=6OaFZJjHnE1IELdn-0)
- Проект развернут на [Netlify] (https://magical-baklava-3facb3.netlify.app)

- yandex cloud https://bba567sef34nnrnhaig6.containers.yandexcloud.net/

## Инструменты
Сборщик - parcel
Шаблонизатор - handlebars
Стили - postcss


npm uninstall husky && git config --unset core.hooksPath

docker build -t chat-app:dev -f Dockerfile .
docker run -p 3000:3000 -it chat-app:dev
cntl-p+cntl-q

docker container ps
docker stop <CONTAINER ID>
