import { Link } from 'react-router-dom';
import './NotFoundPage.css'
const NotFoundPage = () => {
    return (
        <div className="not-found">
            <h1>404</h1>
            <h2>Сторінку не знайдено</h2>
            <p>Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена.</p>
            <Link to="/" className="home-link">Повернутися на головну</Link>
        </div>
    );
};

export default NotFoundPage;