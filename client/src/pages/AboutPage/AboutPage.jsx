import React from 'react';
import { FaBuilding, FaUsers, FaHandshake, FaAward } from 'react-icons/fa';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <>
            <section className="about-hero">
                <div className="about-hero-overlay">
                    <h1>Про мене</h1>
                    <p>
                        Я займаюся будівництвом та продажем приватних будинків з 2010 року. Організовую весь процес — від вибору ділянки до здачі готового об'єкта.
                        Працюю з надійними майстрами та особисто контролюю кожен етап: фундамент, стіни, дах, електрика, сантехніка, оздоблення. Пропоную будинки у різних форматах — з ремонтом, без або “під ключ”.
                    </p>
                </div>
            </section>

            <section className="about-content">
                <div className="about-intro">
                    <h2>Моя історія</h2>
                    <p>
                        З 2010 року я реалізую проєкти приватного житла. Починав з невеликих будівництв, і поступово сформував команду перевірених фахівців, з якими разом створюємо надійні й комфортні будинки.
                        За роки роботи десятки клієнтів вже оселилися в домах, які я організував від нуля до передачі ключів.
                    </p>
                    <p>
                        Моя мета — зробити покупку будинку простою та чесною. Ви отримуєте житло без посередників, з прозорими умовами та реальними гарантіями.
                    </p>
                </div>

                <div className="about-values">
                    <h2>Мої принципи</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <FaBuilding className="value-icon" />
                            <h3>Якість</h3>
                            <p>
                                Будую лише з перевірених матеріалів. Кожен етап робіт контролюється — від фундаменту до даху.
                            </p>
                        </div>
                        <div className="value-item">
                            <FaUsers className="value-icon" />
                            <h3>Клієнтоорієнтованість</h3>
                            <p>
                                Пропоную варіанти під ваші потреби — будинки з ремонтом, без або “під ключ”. Враховую побажання на всіх етапах.
                            </p>
                        </div>
                        <div className="value-item">
                            <FaHandshake className="value-icon" />
                            <h3>Чесність</h3>
                            <p>
                                Ніяких прихованих умов. Ви знаєте, що отримуєте і за які кошти. Прозорі угоди — мій принцип.
                            </p>
                        </div>
                        <div className="value-item">
                            <FaAward className="value-icon" />
                            <h3>Професіоналізм</h3>
                            <p>
                                Працюю з командою досвідчених майстрів. Кожен спеціаліст відповідає за свою частину, а я — за результат в цілому.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="about-team">
                    <h2>Команда виконавців</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="team-member-image" style={{ backgroundImage: 'url("/images/placeholder-house.jpg")' }}></div>
                            <h3>Будівельна бригада</h3>
                            <p className="team-position">Зведення коробки будинку</p>
                            <p>Майстри з досвідом понад 10 років. Якість та дотримання термінів — гарантія.</p>
                        </div>
                        <div className="team-member">
                            <div className="team-member-image" style={{ backgroundImage: 'url("/images/placeholder-house.jpg")' }}></div>
                            <h3>Електрики та сантехніки</h3>
                            <p className="team-position">Інженерні мережі</p>
                            <p>Забезпечують надійність систем та відповідність сучасним стандартам.</p>
                        </div>
                        <div className="team-member">
                            <div className="team-member-image" style={{ backgroundImage: 'url("/images/placeholder-house.jpg")' }}></div>
                            <h3>Майстри оздоблення</h3>
                            <p className="team-position">Ремонт та декор</p>
                            <p>Виконують роботи з урахуванням сучасних технологій та дизайну.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutPage;
