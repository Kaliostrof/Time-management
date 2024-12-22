# React + Vite

Области хранения данных:

-   база данных MongoDB
-   Redux store

Сущности приложения:

-   пользователь: БД(список пользователей), Store(отображения в браузере)
-   проекты: БД(список проектов), Store(отображения в браузере)
-   задачи: БД(список задач), Store(отображения в браузере)

Таблицы БД:

-   пользователи - users: id / login / email / password / avatar / date_of_birth / registred_at

-   проекты: projects: id / title / total_time / user_id / published_at

-   задачи: tasks: id / project_id / description / time / published_at

Схема для редакс стора (на клиенте):

-   user: id / login / session
-   projects: id / title / totalTime / tasks: массив task: id / project_id / description / time / publishedAt

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
