# Freya.Lighthouse.MultiTasker

## Описание
Проект для аудирования и сравнения производительности сайтов с помощью библиотеки [Lighthouse](https://github.com/GoogleChrome/lighthouse).
Данный проект позволяет проверить несколько сайтов во всех возвожных конфигурациях.

## Как начать
Для работы проекта нужна [node.js](https://nodejs.org/en/).
Чтобы запустить аудирование нужно:
1. Скачать проект
2. Запустить команду `npm i' в папке проекта, чтобы скачать все нужные библиотеки
3. Добавить свой конфиг или отредактировать текущий конфиг
4. Выполнить в терминале из папки проекта `node index.js`

## Конфигурация
Пример конфигурации из папки проекта `config`
```
'use strict';

module.exports = {
    sites: [
        "https://pikabu.ru",
        "https://yandex.ru"
    ],
    emulatedFormFactors: ["desktop"],
    throttlingMethods: ["provided", "simulated"],
    repeat: 3,
    withFullReport: false
}
```
При запуске с данным кофигом аудит будет проведет 12 раз - для каждого сайта и комбинации `emulatedFormFactors` и `throttlingMethods`.
`withFullReport`: для каждого запуска сохраняет подробную аналитику в файл json

### Доступные варианты throttlingMethods и emulatedFormFactors

throttlingMethods = [
    devtools: applied slow, 
    provided: no restrictions,
    simulated: simulated slow
],
emulatedFormFactors = [
    desktop, mobile
]

## Результат
Результатом работы программы является файл в папке `/results/result.txt` с значениями `performance`

Пример результата:
```
https___pikabu_ru_desktop_provided: 0.9

https___pikabu_ru_desktop_provided: 0.7
```
