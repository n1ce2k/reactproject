import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Button, List, Card, Row, Col } from 'antd';

interface Film {
    url: string;
    title: string;
}

interface Character {
    url: string;
    name: string;
}

interface CharacterDetails {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
}

function App() {
    const [films, setFilms] = useState<Film[]>([]);
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [characterDetails, setCharacterDetails] = useState<CharacterDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchFilms();
    }, []);

    const fetchFilms = async () => {
        try {
            const response = await axios.get<{ results: Film[] }>('/api/swapi/films');
            setFilms(response.data.results);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchCharacters = async (filmUrl: string) => {
        try {
            const response = await axios.get<{ characters: string[] }>(filmUrl);
            const characterUrls = response.data.characters;
            const charactersData = await Promise.all(
                characterUrls.map(async (characterUrl) => {
                    const response = await axios.get<Character>(characterUrl);
                    return response.data;
                })
            );
            setCharacters(charactersData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCharacterDetails = async (characterUrl: string) => {
        try {
            const response = await axios.get<CharacterDetails>(characterUrl);
            setCharacterDetails(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilmSelect = (film: Film) => {
        setSelectedFilm(film);
        setSelectedCharacter(null);
        setCharacterDetails(null);
        fetchCharacters(film.url);
    };

    const handleCharacterSelect = (character: Character) => {
        setSelectedCharacter(character);
        fetchCharacterDetails(character.url);
    };

    return (
        <div className="custom-container">
            <h1>Звёздные войны Фильмы</h1>
            {loading ? (
                <Spin  size="large" />
            ) : (
                <Row gutter={[16, 16]}>
                    {films.map((film) => (
                        <Col key={film.url} xs={24} sm={24} md={8} xl={6}>
                            <Card title={film.title}>
                                <Button className="buttonChoose" onClick={() => handleFilmSelect(film)}>Выбрать</Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {selectedFilm && (
                <div>
                    <h2>Персонаж из {selectedFilm.title}</h2>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Row gutter={[16, 16]}>
                            {characters.map((character) => (
                                <Col key={character.url} xs={24} sm={24} md={8} xl={6}>
                                    <Card title={character.name}>
                                        <Button className="buttonChoose" onClick={() => handleCharacterSelect(character)}>Выбрать</Button>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            )}

            {selectedCharacter && characterDetails && (
                <div  className="blockInfo">
                    <h2>Характеристики</h2>
                    <p>Имя: {characterDetails.name}</p>
                    <p>Рост: {characterDetails.height}</p>
                    <p>Масса: {characterDetails.mass}</p>
                    <p>Цвет волос: {characterDetails.hair_color}</p>
                    <p>Общий Цвет: {characterDetails.skin_color}</p>
                    <p>Цвет глаз: {characterDetails.eye_color}</p>
                    <p>Дата рождения: {characterDetails.birth_year}</p>
                    <p>Пол: {characterDetails.gender}</p>
                </div>
            )}
        </div>
    );
}

export default App;
