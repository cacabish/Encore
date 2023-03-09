import React from 'react';
import './App.css';
import { createAndDownloadBlobFile } from './mus/createmus';

function App() {
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const form = e.target as typeof e.target & {
            songTitle: { value: string };
            gameTitle: { value: string };
            composer: { value: string };
            arranger: { value: string };
            company: { value: string };
            year: { value: string };
        };
        const title = form['songTitle'].value;
        const game = form['gameTitle'].value;
        const composer = form['composer'].value;
        const arranger = form['arranger'].value;
        const company = form['company'].value;
        const year = form['year'].value;

        createAndDownloadBlobFile(title, game, composer, arranger, company, year);
    }

    return (
        <form
            id='mainForm'
            method='post'
            onSubmit={handleSubmit}
            autoComplete='off'
        >
            <fieldset>
                <legend>Song Details:</legend>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor='youtubeLink'>YouTube Link:</label>
                            </td>
                            <td colSpan={3}>
                                <input
                                    type='text'
                                    id='youtubeLink'
                                    name='youtubeLink'
                                    placeholder='https://www.youtube.com/watch?v=fC7oUOUEEi4'
                                    // pattern='(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})'
                                    title='YouTube URL'
                                    required
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor='songTitle'>Song Title:</label>
                            </td>
                            <td>
                                <input
                                    type='text'
                                    id='songTitle'
                                    name='songTitle'
                                    pattern='^".+"$'
                                    title='Starts and ends with quotes (")'
                                    required
                                ></input>
                            </td>
                            <td>
                                <label htmlFor='gameTitle'>Game Title:</label>
                            </td>
                            <td>
                                <input
                                    type='text'
                                    id='gameTitle'
                                    name='gameTitle'
                                    required
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor='composer'>Composer:</label>
                            </td>
                            <td>
                                <input
                                    type='text'
                                    id='composer'
                                    name='composer'
                                    required
                                ></input>
                            </td>
                            <td>
                                <label htmlFor='arranger'>Arranger:</label>
                            </td>
                            <td>
                                <input
                                    type='text'
                                    id='arranger'
                                    name='arranger'
                                    required
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor='company'>Company:</label>
                            </td>
                            <td>
                                <input
                                    type='text'
                                    id='company'
                                    name='company'
                                    required
                                ></input>
                            </td>
                            <td>
                                <label htmlFor='year'>Year:</label>
                            </td>
                            <td>
                                <input
                                    type='number'
                                    id='year'
                                    name='year'
                                    min={1900}
                                    max={2100}
                                    step={1}
                                    defaultValue={2023}
                                    required
                                ></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <input
                    type='submit'
                    value='Submit'
                    required
                ></input>
            </fieldset>
        </form>
    );
}

export default App;

