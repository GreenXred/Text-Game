// Объект героя с начальными значениями
const hero = {
    level: 1,
    health: 100,
    damage: 20,
    defend: 5,
    dexterity: 5,
    inventory: {
        healthPotions: 1,
        damagePotions: 0,
        defendPotions: 0,
        dexterityPotions: 0,

    }
};

const enemies = [
    {
        name: 'Бандит',
        health: 70,
        damage: 20,
        defend: 5,
        dexterity: 15,
    },
    {
        name: 'Гоблин',
        health: 55,
        damage: 16,
        defend: 0,
        dexterity: 32,
    },
    {
        name: 'Скелетон',
        health: 40,
        damage: 15,
        defend: 10,
        dexterity: 8,
    },
    {
        name: 'Тролль',
        health: 140,
        damage: 22,
        defend: 12,
        dexterity: 5,
    },
    {
        name: 'Волк',
        health: 55,
        damage: 17,
        defend: 4,
        dexterity: 40,
    },
    {
        name: 'Шайка беспризорников',
        health: 120,
        damage: 16,
        defend: 0,
        dexterity: 18,
    },
    {
        name: 'Буйный пьяница',
        health: 45,
        damage: 12,
        defend: 10,
        dexterity: 0,
    },
    {
        name: 'Старая каннибалиха',
        health: 68,
        damage: 19,
        defend: 14,
        dexterity: 18,
    },
    {
        name: 'Здоровенный мужлан',
        health: 125,
        damage: 25,
        defend: 20,
        dexterity: 8,
    }
];

const usedLocations = [];

const locations = [
    // Повторяемые
    {
        id: 'forest',
        name: 'Лес',
        type: 'battle',
        enemy: getEnemyByName('Бандит'),
        repeatable: true
    },
    {
        id: 'dungeon',
        name: 'Подземелье',
        type: 'battle',
        enemy: getEnemyByName('Гоблин'),
        repeatable: true
    },
    {
        id: 'graveyard',
        name: 'Кладбище',
        type: 'battle',
        enemy: getEnemyByName('Скелетон'),
        repeatable: true
    },

    // Одноразовые — боевые и ивенты
    {
        id: 'church',
        name: 'Церковь',
        type: 'event',
        repeatable: false,
        effect: () => {
            hero.inventory.healthPotions++;
            healHero(35);
            updateHeroView();
            logEvent(`
                Издалека раздавались удары колокола. Вы пошли на звон и обнаружили отдаленный небольшой монастырь. 
                Один из монахов заметив Вас, тепло поприветствовал и предложил остаться на духовную беседу. 
                После приятного разговора вы искупались в пруду близ монастыря и по приглашению настоятеля присоединились к вечерней монастырской трапезе. 
                Переночевав, вы продолжили свой путь рано утром. Настоятель просунул Вам в руку зелье здоровья и пожелал удачи.
            `);
        }
    },
    {
        id: 'training',
        name: 'Тренировочная площадка',
        type: 'event',
        repeatable: false,
        effect: () => {
            hero.damage += 5;
            updateHeroView();
            logEvent(`
                Вы наткнулись на небольшое расчищенное поле. На поле стояли манекены набитые соломой и мишени для стрельбы из лука и арбалета. 
                Солдаты, упражняющиеся на мечах, увидев Вас предложили потренироваться. Взяв деревянный тренировочный меч, вы размахивали из стороны в сторону, 
                едва попадая по стоячему манекену. Солдаты залились смехом. Сержант дал Вам пару уроков и Ваш навык боя ощутимо вырос.
            `);
        }
    },
    {
        id: 'cave',
        name: 'Пещера',
        type: 'battle',
        enemy: getEnemyByName('Тролль'),
        repeatable: false,
        doubleLevel: true,
        effect: () => {
            logEvent(`
                Вы наткнулись на пещеру, которая подозрительно смердит, но Ваше любопытство взяло вверх и вы вошли в нее. 
                Пройдя вглубь, вы видите тупик, а на земле разбросаны останки животных и отчетливо замечаете человеческие кости. 
                Вас пронзил страх, но как только вы собрались развернуться и покинуть пещеру, раздался оглушительный рев и из-за темного угла поднялся жирнющий Тролль. 
            `);
        }
    },
    {
        id: 'dark-forest',
        name: 'Темная чаща',
        type: 'battle',
        enemy: getEnemyByName('Волк'),
        repeatable: false,
        effect: () => {
            logEvent(`
                Вы забредаете в темную чащу леса. Неожиданно, вы слышите мощный рык и замечаете крупного волка. 
            `);
        }
    },
    {
        id: 'cart',
        name: 'Перевернутая телега',
        type: 'battle',
        enemy: getEnemyByName('Шайка беспризорников'),
        repeatable: false,
        effect: () => {
            logEvent(`
                Идя по тропе, вы наткнулись на сломанную телегу, спереди под ней лежит мертвая кобыла. Неясно, что здесь произошло. 
                Как только вы собрались продолжить путь, из кустов выбегает шайка беспризорников и писклявым голосом один из них угрожает Вам разделить 
                участь мертвой кобылы, если не отдадам свои вещи. Совсем охренели пиздюки, подумали вы, и взяли деревянное полено, которое лежало рядом с телегой. 
                Вы решили их проучить, раздав пиздячек паленом. 
            `);
        }
    },
    {
        id: 'thick-forest',
        name: 'Густой лес',
        type: 'event',
        repeatable: false,
        effect: () => {
            hero.inventory.dexterityPotions++;
            updateHeroView();
            logEvent(`
                Идя по густому лесу, в какой-то момент вы услышали подозрительный шелест, оглянувшись, вы ничего не заметили странного, 
                но через мгновение Вам накидывают мешок на голову и связывают. Когда Вас развязали и сняли мешок, вы видите, что сидите в клетке в цыганском таборе. 
                На ваши вопросы никто не реагирует. Похоже, Вас продадут в рабство или учесть будет куда хуже. 
                Позже поздно вечером, после шумных плясок и попоек, табор разбрелся спать крепким сном. 
                Откуда ни возьмись, к клетке подбегает цыганенок и отпирает замок, вы немного замешкались, но цыганенок всучил вам бутылек и подтолкнул. 
                Вы убежали сломя голову.
            `);
        }
    },
    {
        id: 'tavern',
        name: 'Таверна',
        type: 'battle',
        enemy: getEnemyByName('Буйный пьяница'),
        repeatable: false,
        effect: () => {
            logEvent(`
                По пути у тропы вы видите таверну. Не смотря на то, что у Вас нет ни гроша, вы решаетесь зайти просто передохнуть. 
                Через какое-то время, среди пьяниц завязывается потасовка и вся таверна превратилась в ринг боев без правил. 
                Здесь стало очень неспокойно, подумали вы и решили покинуть таверну, но путь к выходу Вам преградил буйный пьяница. 
                Он что-то прокричал про мою мать, завопел и начал замахиваться кулаками.
            `);
        }
    },
    {
        id: 'ruins',
        name: 'Старые развалины замка',
        type: 'event',
        repeatable: false,
        effect: () => {
            hero.inventory.damagePotions++;
            updateHeroView();
            logEvent(`
                На вашем горизонте стоят руины замка. Вы решили их обследовать. Пройдя вглубь руин, вы замечаете множество палаток. 
                Помимо мужиков разного социального статуса и опрятности, повсюду откровенно выглядящие девки, некоторые из этих девок показывают забавные жесты. 
                Чтобы это значило? Одна из девушек приветливо улыбается Вам и угощает дешевым вином. Вы мило беседуете. Судьба у девушки непростая. 
                Оказывается, она из знатной семьи и была обещана на выдачу в замуж другой знатной семье, но из-за хитрых интриг вторых, всю ее семью казнили, 
                а ее обесчестили и выкинули на улицу. Ее заметили и приютили к себе странствующие блудницы. Ужасная у девушки судьба.
                Под конец беседы, девушка Вас поцеловала и передала бутылек, который однажды забыл у нее в палатке местный шахтер. Вы продолжили путь.
            `);
        }
    },
    {
        id: 'hut',
        name: 'Одинокая хижина',
        type: 'event',
        repeatable: false,
        effect: () => {
            hero.inventory.defendPotions++;
            updateHeroView();
            logEvent(`
                На опушке леса стоит хижина, подойдя ближе, вы видите седого деда, который курит трубку. Он Вас замечает и машет рукой. 
                Дед угощает Вас разными настойками и рассказывает много нелепицы. Что-то про кольца, каких-то эльфов и орков, про колдунов и древнее зло. 
                Вот же чудак! На прощание дед дал Вам в путь одну из своих настоек. Вы продолжили путь.
            `);
        }
    },
    {
        id: 'pot',
        name: 'Круглый чан',
        type: 'battle',
        enemy: getEnemyByName('Старая каннибалиха'),
        repeatable: false,
        doubleLevel: true,
        effect: () => {
            logEvent(`
                Идя в лесу, вы обнаруживаете палатку, а близ нее большой круглый чан. Приблизившись, вы никого не замечаете.
                Из чана скверно пахнет, а приглядевшись, вы замечаете в чане с супом глаза и пальцы. Рядом на столе лежал кулон с необычной гравировкой. 
                Буквально через мгновение раздается голос: «Ммммм, свежее мясо само пришло на обед. Но сначала я позабавлюсь с твоим красивым трупом!». 
                Вы видите перед собой старую каннибалиху, нужно прекратить ее пиршества!
           `);
        }
    },
    {
        id: 'arena',
        name: 'Бойцовская арена',
        type: 'battle',
        enemy: getEnemyByName('Здоровенный мужлан'),
        repeatable: false,
        doubleLevel: true, // двойное срабатывание повышения уровня
        effect: () => {
            logEvent(`
                Продолжая свое путешествие, вы выходите на поляну, по среди которой стоит ринг и толпы ликующих людей. 
                Вы приближаетесь к рингу и видите, как здоровенный мужлан втаптывает другого бойца в землю. Публика в восторге. 
                Мужлан закричал «Кто следующий?», но желающих не было. Какого-то черта вас схватили за руки и выкинули на ринг. 
                Вы попытались уйти с ринга, но толпа Вам этого не давала. Похоже, с ринга своими ногами я уже не уйду, подумали вы.
           `);
        }
    },
    {
        id: 'hut-old',
        name: 'Ветхая изба',
        type: 'event',
        repeatable: false,
        effect: () => {
            healHero(20);
            updateHeroView();
            logEvent(`
                Вы поднимаетесь на холм и видите неподалеку стоит ветхая изба. Приблизившись к избе, оттуда выходит старушка и громко радостно произносит:
                «Милок, внучек, ты вернулся! Зачем же ты меня так нервничать заставляешь?» Бабушка подойдя поближе и приглядевшись сильно расстроилась: 
                «Ах, нет, это не мой Якубка. Переживаю я за него, внучека моего, никого у него больше нет кроме меня. 
                Вот отправился в соседнюю деревню на рынок, так два две дня уже ни сном ни духом. Боюсь случилось чего, ой сердце не на месте!» 
                На бабушке весел кулон с интересной гравировкой. Похожий кулон лежал на столе у каннибалихи рядом с чаном с частями тела. 
                Возможно я ошибаюсь, поэтому ничего не стал рассказывать бабушке. Надеюсь Якубка скоро вернется домой. Вы предложили бабушке помочь по хозяйству. 
                В благодарность бабушка испекла вкусный пирог и приготовила чай на травах. Ранним утром вы отправились дальше.
           `);
        }
    }
];


const initialStory = `Вы сын обычного фермера. Вы обречены на жизнь среди навоза и грязи, а ваше спальное место —
это куча подложенной соломы. Так жили твои предки много поколений. Тебе никогда не светит жизнь среди знати
и сон в уютной, теплой и чистой постели. Казалось, что ты так и проживешь свою жизнь среди свиней и коз
до конца своих дней. Но в отличие от своих дедов, у тебя есть желание и амбиции на лучшую жизнь.
Я сын фермера, таких в городах не берут даже в подмастерья подметать полы. Значит, я должен найти свой путь!
Я собрал немного запасов еды и прихватил старое бабкино зелье, она уверяла, что оно придает сил.
Я отправлюсь на поиски лучшей жизни. Кто знает, что меня ждет? Слава и богатство или глупая смерть?
Но я должен попытаться! Я покинул деревню поздно ночью, чтобы меня не заметили. Куда же мне теперь направиться...`;


// Функция получения врага по его имени
function getEnemyByName(name) {
    return enemies.find(e => e.name === name);
}

// Функция отрисовки доступных локаций

let isInitialStage = true;  // Флаг первой выборки локаций

function renderAvailableLocations() {
    const container = document.querySelector('.locations-buttons');
    container.innerHTML = '';
    // Все доступные локации (базовые и неиспользованные одноразовые)
    const available = locations.filter(loc => loc.repeatable || !usedLocations.includes(loc.id));
    const sample = getRandomSample(available, 3);

    sample.forEach(loc => {
        const btn = document.createElement('button');
        btn.textContent = loc.name;
        btn.classList.add('location-button');
        btn.addEventListener('click', () => handleLocation(loc));
        container.appendChild(btn);
    });
}



function getRandomSample(arr, n) { // Функция для получения случайного набора элементов из массива
    const copy = [...arr]; // Копирование массива
    const result = []; // Массив для результата
    while (result.length < Math.min(n, copy.length)) { // Пока результат меньше n и длина копии массива больше 0 
        const idx = Math.floor(Math.random() * copy.length); // Выбор случайного индекса
        result.push(copy.splice(idx, 1)[0]); // Добавление элемента в результат и удаление из копии
    }
    return result;
}

// Обработка выбранной локации

function handleLocation(location, isInitial = false) {
    // Скрыть стартовые кнопки после первого выбора
    if (isInitial) {
        document.querySelectorAll('.button-forest, .button-dungeon, .button-cemetery').forEach(btn => btn.style.display = 'none');
        isInitialStage = false; // Теперь показываем любые локации
    }

    // Если локация одноразовая — пометить использованной
    if (!location.repeatable) {
        usedLocations.push(location.id);
    }

    document.querySelector('.current-location').textContent = location.name;

    if (location.type === 'event') {
        location.effect();
        renderAvailableLocations();
    } else if (location.type === 'battle') {
        if (location.effect) location.effect();
        document.querySelector('.locations-buttons').innerHTML = '';
        startBattle(location.enemy, location.doubleLevel);
    }
}


// Функция обновления отображения характеристик

function updateHeroView() {
    // Обновление отображения уровня героя
    document.querySelector('.level-hero').textContent = `Уровень: ${hero.level}`;
    document.querySelector('.health').textContent = `Здоровье: ${hero.health}`;
    document.querySelector('.damage').textContent = `Урон: ${hero.damage}`;
    document.querySelector('.defend').textContent = `Защита: ${hero.defend}`;
    document.querySelector('.dexterity').textContent = `Ловкость: ${hero.dexterity}`;

    // Обновление отображения инвентаря героя
    document.querySelector('.health-potions').textContent = `Зелья здоровья: ${hero.inventory.healthPotions}`;
    document.querySelector('.damage-potions').textContent = `Зелья урона: ${hero.inventory.damagePotions}`;
    document.querySelector('.defend-potions').textContent = `Зелья защиты: ${hero.inventory.defendPotions}`;
    document.querySelector('.dexterity-potions').textContent = `Зелья ловкости: ${hero.inventory.dexterityPotions}`;
}

// Обновление отображения характеристик при загрузке страницы

updateHeroView();

// Изменение здоровья при получении урона

function takeDamage(damage) {
    hero.health -= damage; // Уменьшение здоровья героя на полученный урон
    if (hero.health < 0) // Чтобы здоровье не было отрицательным
        hero.health = 0;
    updateHeroView(); // Обновление отображения характеристик
}

// Функция получения зелья

function getHealthPotion() {
    hero.inventory.healthPotions++; // Увеличение количества зелий здоровья на 1
    updateHeroView();
}
function getDefendPotion() {
    hero.inventory.damagePotions++; // Увеличение количества зелий здоровья на 1
    updateHeroView();
}
function getHealthPotion() {
    hero.inventory.defendPotions++; // Увеличение количества зелий здоровья на 1
    updateHeroView();
}
function getHealthPotion() {
    hero.inventory.dexterityPotions++; // Увеличение количества зелий здоровья на 1
    updateHeroView();
}

// Функции применения зелья

function useHealthPotion() {
    if (hero.inventory.healthPotions > 0) {
        hero.health += 25; // Увеличение здоровья героя на 25
        hero.inventory.healthPotions--; // Уменьшение количества зелий здоровья на 1
        if (hero.health > 100) {
            hero.health = 100; // Чтобы здоровье не было больше 100
        }
    }
    updateHeroView(); // Обновление отображения характеристик
}

function useDamagePotion() {
    if (hero.inventory.damagePotions > 0) {
        hero.damage += 10; // Увеличение урона героя на 10
        hero.inventory.damagePotions--; // Уменьшение количества зелий здоровья на 1
    }
    updateHeroView(); // Обновление отображения характеристик
}

function useDefendPotion() {
    if (hero.inventory.defendPotions > 0) {
        hero.defend += 10; // Увеличение защиты героя на 10
        hero.inventory.defendPotions--; // Уменьшение количества зелий здоровья на 1
    }
    updateHeroView(); // Обновление отображения характеристик
}

function useDexterityPotion() {
    if (hero.inventory.dexterityPotions > 0) {
        hero.dexterity *= 2; // Увеличение ловкости героя в 2 раза
        hero.inventory.dexterityPotions--; // Уменьшение количества зелий здоровья на 1
    }
    updateHeroView(); // Обновление отображения характеристик
}

// Функции применения зелий 

document.querySelector('.health-potions').addEventListener('click', () => {
    if (hero.inventory.healthPotions > 0) {
        useHealthPotion();
        logEvent(`Вы использовали ${colorText('зелье здоровья', 'health-text')} и восстановили ${colorText('25 здоровья', 'health-text')}!`);
    } else {
        alert('У вас нет зелья здоровья!');
    }
});

document.querySelector('.damage-potions').addEventListener('click', () => {
    if (!isBattleActive) {
        logEvent(`Зелье урона можно использовать только во время боя.`);
        return;
    }
    if (hero.inventory.damagePotions > 0) {
        useDamagePotion();
        logEvent(`Вы использовали ${colorText('зелье урона', 'damage-text')} и увеличили свой урон на ${colorText('10', 'damage-text')}!`);
    } else {
        alert('У вас нет зелья урона!');
    }
});

document.querySelector('.defend-potions').addEventListener('click', () => {
    if (!isBattleActive) {
        logEvent(`Зелье защиты можно использовать только во время боя.`);
        return;
    }
    if (hero.inventory.defendPotions > 0) {
        useDefendPotion();
        logEvent(`Вы использовали ${colorText('зелье защиты', 'levelUp-defend-text')} и увеличили защиту на ${colorText('10', 'levelUp-defend-text')}!`);
    } else {
        alert('У вас нет зелья защиты!');
    }
});

document.querySelector('.dexterity-potions').addEventListener('click', () => {
    if (!isBattleActive) {
        logEvent(`Зелье ловкости можно использовать только во время боя.`);
        return;
    }
    if (hero.inventory.dexterityPotions > 0) {
        useDexterityPotion();
        logEvent(`Вы использовали ${colorText('зелье ловкости', 'levelUp-dexterity-text')} и увеличили ловкость в ${colorText('2 раза', 'levelUp-dexterity-text')}!`);
    } else {
        alert('У вас нет зелья ловкости!');
    }
});

// Функции для восполнения здоровья (удобно для ивентов)
function healHero(amount) {
    hero.health = Math.min(100, hero.health + amount);
    updateHeroView();
}

// Обработчик для леса
document.querySelector('.button-forest').addEventListener('click', () => {
    handleLocation({
        id: 'forest',
        name: 'Лес',
        type: 'battle',
        enemy: getEnemyByName('Бандит'),
        repeatable: true
    }, true);
});

// Для подземелья
document.querySelector('.button-dungeon').addEventListener('click', () => {
    handleLocation({
        id: 'dungeon',
        name: 'Подземелье',
        type: 'battle',
        enemy: getEnemyByName('Гоблин'),
        repeatable: true
    }, true);
});

// Для кладбища
document.querySelector('.button-cemetery').addEventListener('click', () => {
    handleLocation({
        id: 'graveyard',
        name: 'Кладбище',
        type: 'battle',
        enemy: getEnemyByName('Скелетон'),
        repeatable: true
    }, true);
});

// Сброс игры при нажатии кнопки

document.querySelector('.restart-button').addEventListener('click', () => {
    Object.assign(hero, {
        level: 1,
        health: 100,
        damage: 20,
        defend: 5,
        dexterity: 5,
        inventory: {
            healthPotions: 1,
            damagePotions: 0,
            defendPotions: 0,
            dexterityPotions: 0
        }
    });

    usedLocations.length = 0;
    isInitialStage = true;
    document.querySelectorAll('.button-forest, .button-dungeon, .button-cemetery').forEach(btn => btn.style.display = '');
    document.querySelector('.locations-buttons').innerHTML = '';

    // Разблокировка всех кнопок
    document.querySelector('.attack-button').disabled = false;
    document.querySelector('.defend-button').disabled = false;
    document.querySelector('.escape-button').disabled = false;
    document.querySelectorAll('.location-button, .button-forest, .button-dungeon, .button-cemetery').forEach(btn => btn.disabled = false);


    document.querySelector('.enemy-type').textContent = '';
    document.querySelector('.enemy-health').textContent = '';
    document.querySelector('.enemy-damage').textContent = '';
    document.querySelector('.enemy-defend').textContent = '';
    document.querySelector('.enemy-dexterity').textContent = '';

    updateHeroView();

    // Очистка текстового лога и возврат начальной истории

    const log = document.querySelector('.current-events-log');
    log.innerHTML = '';
    const paragraph = document.createElement('p');
    paragraph.textContent = initialStory;
    log.appendChild(paragraph);
});

// Добавляем переменные для управления боем
let currentEnemy = null;
let isBattleActive = false;
let isWaiting = false;
let pendingLevelUps = 1; // Подсчет количества уровней, которые нужно повысить
baseHeroStats = {
    damage: hero.damage,
    defend: hero.defend,
    dexterity: hero.dexterity
};

// Обработчики кнопок действий

document.querySelector('.attack-button').addEventListener('click', handleAttack);
document.querySelector('.defend-button').addEventListener('click', handleDefend);
document.querySelector('.escape-button').addEventListener('click', handleEscape);

const hintBox = document.querySelector('.action-hint');

// Отображение единиц 

document.querySelector('.attack-button').addEventListener('mouseenter', () => {
    if (!currentEnemy) return;
    const potentialDamage = Math.max(1, hero.damage - currentEnemy.defend);
    hintBox.textContent = `Удар нанесёт ~${potentialDamage} урона врагу`;
});
document.querySelector('.attack-button').addEventListener('mouseleave', () => hintBox.textContent = '');

document.querySelector('.defend-button').addEventListener('mouseenter', () => {
    if (!currentEnemy) return;
    const blockChance = Math.max(0, hero.defend * 6 - currentEnemy.dexterity);
    hintBox.textContent = `Шанс блокировать удар и контратаковать: ${blockChance}%`;
});
document.querySelector('.defend-button').addEventListener('mouseleave', () => hintBox.textContent = '');

document.querySelector('.escape-button').addEventListener('mouseenter', () => {
    if (!currentEnemy) return;
    const escapeChance = Math.max(0, hero.dexterity * 6 - currentEnemy.dexterity);
    hintBox.textContent = `Шанс сбежать: ${escapeChance}%`;
});
document.querySelector('.escape-button').addEventListener('mouseleave', () => hintBox.textContent = '');


function logEvent(text) {
    const log = document.querySelector('.current-events-log');

    const newLine = document.createElement('p'); // Создаем новый элемент p
    newLine.innerHTML = text; // Добавляем текст в элемент

    log.appendChild(newLine); // Добавляем элемент в конец списка событий

    // Прокрутка вниз при добавлении нового события
    log.scrollTop = log.scrollHeight;
}


// Начало боя
function startBattle(enemy, doubleLevel = false) {
    currentEnemy = { ...enemy }; // копия объекта, чтобы не менять оригинал
    isBattleActive = true;
    pendingLevelUps = doubleLevel ? 2 : 1; // если двойное повышение уровня, то 2 два срабатывания level++, иначе 1

    //  Информация о враге в панели enemy-characteristic
    document.querySelector('.enemy-type').textContent = `Противник: ${enemy.name}`;
    document.querySelector('.enemy-health').textContent = `Здоровье: ${enemy.health}`;
    document.querySelector('.enemy-damage').textContent = `Урон: ${enemy.damage}`;
    document.querySelector('.enemy-defend').textContent = `Защита: ${enemy.defend}`;
    document.querySelector('.enemy-dexterity').textContent = `Ловкость: ${enemy.dexterity}`;

    logEvent(`Вы встретили ${colorText(enemy.name, 'type-enemy-text')}!`);

    baseHeroStats = {
        damage: hero.damage,
        defend: hero.defend,
        dexterity: hero.dexterity
    };

    if (enemy.name === 'Бандит') {
        document.querySelector('.current-location').textContent = `Вы находитесь в лесу`;
    } else if (enemy.name === 'Гоблин') {
        document.querySelector('.current-location').textContent = `Вы находитесь в подземелье`;
    } else if (enemy.name === 'Скелетон') {
        document.querySelector('.current-location').textContent = `Вы находитесь на кладбище`;
    }

    updateHeroView();
}

// Атака
function handleAttack() {
    if (!isBattleActive || !currentEnemy || isWaiting) return;

    const enemyDodgeRoll = Math.random() * 100; // роллим, чтобы определить, уклонился ли враг
    if (enemyDodgeRoll < currentEnemy.dexterity) {
        logEvent(`${colorText(currentEnemy.name, 'type-enemy-text')} увернулся от вашей атаки!`);
    } else {
        // Урон = урон героя - защита врага с разбросом +-10:
        let baseDamage = Math.max(1, hero.damage - currentEnemy.defend);
        let variation = 0.9 + Math.random() * 0.2; // от 0.9 до 1.1
        let damageDealt = Math.round(baseDamage * variation);
        currentEnemy.health -= damageDealt;
        if (currentEnemy.health < 0) currentEnemy.health = 0;

        logEvent(`Вы ударили ${colorText(currentEnemy.name, 'type-enemy-text')} на ${colorText(damageDealt, 'damage-text')} урона! Здоровье врага: ${colorText(currentEnemy.health, 'health-text')}`);
        if (currentEnemy.health <= 0) {
            endBattle(true);
            return;
        }
    }

    isWaiting = true;
    setTimeout(enemyTurn, 1000);
}

// Защита
function handleDefend() {
    if (!isBattleActive || !currentEnemy) return;

    const blockChance = hero.defend * 6 - currentEnemy.dexterity; // 1 единица защиты дает 5% шанса блокировать атаку
    const blockRoll = Math.random() * 100; // роллим, чтобы определить, блокировали ли мы
    if (blockRoll < blockChance) {
        let baseCounter = Math.max(1, hero.damage - currentEnemy.defend);
        let counterDamage = Math.round(baseCounter * (0.9 + Math.random() * 0.2));
        currentEnemy.health -= counterDamage;
        if (currentEnemy.health < 0) currentEnemy.health = 0;

        logEvent(`Вы полностью блокировали удар и нанесли ${colorText(counterDamage, 'damage-text')} урона в ответ! Здоровье врага: ${colorText(currentEnemy.health, 'health-text')}`);

        if (currentEnemy.health <= 0) {
            endBattle(true);
            return;
        }
    } else {
        logEvent(`Вы попытались защититься, но враг пробил оборону.`);
        isWaiting = true;
        setTimeout(enemyTurn, 1000);
    }
}

// Побег
function handleEscape() {
    if (!isBattleActive || !currentEnemy || isWaiting) return;

    const escapeChance = hero.dexterity * 6 - currentEnemy.dexterity; // 1 единица ловкости дает 5% шанса сбежать
    const escapeRoll = Math.random() * 100; // роллим, чтобы определить, сбежали ли мы
    if (escapeRoll < escapeChance) {
        logEvent('Вы успешно сбежали из боя!');

        isBattleActive = false;
        currentEnemy = null;
        document.querySelector('.current-location').textContent = `Вы скрылись с поля боя`;
    } else {
        logEvent('Вы не смогли сбежать!');
        isWaiting = true;
        setTimeout(enemyTurn, 1000);
    }
}

// Ход врага
function enemyTurn() {
    isWaiting = false;

    if (!isBattleActive || !currentEnemy) return;

    const heroDodgeRoll = Math.random() * 100;
    if (heroDodgeRoll < hero.dexterity) {
        logEvent(`Вы увернулись от атаки ${colorText(currentEnemy.name, 'type-enemy-text')}!`);
    } else {
        let baseEnemyDamage = Math.max(1, currentEnemy.damage - hero.defend);
        let damage = Math.round(baseEnemyDamage * (0.9 + Math.random() * 0.2));
        takeDamage(damage);
        logEvent(`${colorText(currentEnemy.name, 'type-enemy-text')} ударил вас на ${colorText(damage, 'damage-text')} урона!`);

        if (hero.health <= 0) {
            endBattle(false);
            return;
        }
    }
    updateHeroView();
}


// Завершение боя
function endBattle(heroWon) {
    isBattleActive = false;
    currentEnemy = null;

    hero.damage = baseHeroStats.damage;
    hero.defend = baseHeroStats.defend;
    hero.dexterity = baseHeroStats.dexterity;

    renderAvailableLocations();


    if (heroWon) {
        logEvent('Вы победили! Отправляйтесь дальше');

        const potionTypes = ['health', 'damage', 'defend', 'dexterity'];
        const dropped = potionTypes[Math.floor(Math.random() * potionTypes.length)]; // рандомно выбираем тип зелья за победу

        switch (dropped) {
            case 'health':
                hero.inventory.healthPotions++;
                logEvent(`Вы нашли ${colorText('зелье здоровья', 'health-text')}!`);
                break;
            case 'damage':
                hero.inventory.damagePotions++;
                logEvent(`Вы нашли ${colorText('зелье урона', 'damage-text')}!`);
                break;
            case 'defend':
                hero.inventory.defendPotions++;
                logEvent(`Вы нашли ${colorText('зелье защиты', 'levelUp-defend-text')}!`);
                break;
            case 'dexterity':
                hero.inventory.dexterityPotions++;
                logEvent(`Вы нашли ${colorText('зелье ловкости', 'levelUp-dexterity-text')}!`);
                break;
        }

        updateHeroView();
    } else {

        // Блокировка кнопок действий
        document.querySelector('.attack-button').disabled = true;
        document.querySelector('.defend-button').disabled = true;
        document.querySelector('.escape-button').disabled = true;
        document.querySelector('.locations-buttons').innerHTML = '';

        logEvent('Вы погибли...');
        return;
    }

    for (let i = 0; i < pendingLevelUps; i++) {
        levelUp();
    }
    pendingLevelUps = 1;
}

// Окрашиваем в текст-логе касаемо здоровья и урона

function colorText(text, colorClass) {
    return `<span class="${colorClass}">${text}</span>`;
}

// function levelUp() {
//     hero.level++;

//     // Случайное распределение 5 очков между 3 атрибутами
//     let points = 5;
//     let damageGain = Math.floor(Math.random() * (points + 1)); // рандомное распределение 5 очков между 3 атрибутами 
//     let remain = points - damageGain; // оставшиеся очки

//     let defendGain = Math.floor(Math.random() * (remain + 1)); // рандомное распределение оставшихся очков между 3 атрибутами
//     let dexterityGain = remain - defendGain; // оставшиеся очки

//     hero.dexterity += dexterityGain; 
//     hero.defend += defendGain;
//     hero.damage += damageGain;

//     logEvent(`Вы повысили уровень до ${hero.level}! +${dexterityGain} к ловкости, +${defendGain} к защите, +${damageGain} к урону.`);

//     updateHeroView();
// }

function levelUp() {
    hero.level++;

    // Создаем массив из 5 очков
    const points = [1, 1, 1, 1, 1];

    // Счетчики атрибутов
    let gains = [0, 0, 0]; // [dexterity, defend, damage]

    // Распределяем каждый point случайно
    points.forEach(() => {
        const index = Math.floor(Math.random() * 3); // 0, 1 или 2
        gains[index]++;
    });

    // Применяем
    hero.dexterity += gains[0];
    hero.defend += gains[1];
    hero.damage += gains[2];

    logEvent(
        `${colorText(`Вы повысили уровень`, 'levelUp-text')} до ${colorText(hero.level, 'levelUp-level-text')}! 
        +${colorText(gains[0], 'levelUp-dexterity-text')} к ловкости, +${colorText(gains[1], 'levelUp-defend-text')} 
        к защите, +${colorText(gains[2], 'levelUp-damage-text')} к урону.`
    );

    updateHeroView();

    // Проверка финала
    if (hero.level >= 11) {
        finishGame();
    }
}

function finishGame() {
    logEvent(`
        Несколько лет вы уже скитаетесь по стране. Вы мастерски владеете мечом, а Вашим шрамам позавидовал бы даже самый матерый ветеран столетней войны. 
        Вы повидали уже многое и встречали много интересных личностей. Однажды произошел счастливый случай, который положил конец Вашим скитаниям и нищему существованию. 
        Ваш король со свитой своих лучших стражей отправился в соседние провинции с королевским визитом, но вся свита угодила в засаду, 
        разбойников было много и многие из них бывшие солдаты. По счастливой случайности, вы шли в лесу недалеко от места засады и услышали звуки сражения. 
        Увидев королевскую свиту, вы ринулись в бой на защиту короля. Когда бой закончился, почти все королевские стражи были мертвы. 
        Вы обломили стрелу, которая угодила Вам в плечо и перевели дух. Король никогда не видел бойцов, которые так мастерски владеют боем.
        Король Вас щедро вознаградил и вы приняли предложение стать капитаном королевских стражей, а так же Вам был выдан титул рыцаря. 
        Вы перевезли свою семью из деревни в королевский город. Кровью и потом, вы смогли обеспечить себе безбедную жизнь.`);
    // Блокируем все кнопки
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.classList.contains('restart-button')) {
            btn.disabled = true;
        }
    });
}


document.querySelector('.enemy-type').textContent = '';
document.querySelector('.enemy-health').textContent = '';
document.querySelector('.enemy-damage').textContent = '';
document.querySelector('.enemy-defend').textContent = '';
document.querySelector('.enemy-dexterity').textContent = '';



