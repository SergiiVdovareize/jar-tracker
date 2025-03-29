import jarTracker from "../utils/jarTracker";

const JarForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
        jarTracker.track()
        return false;
    }

    return <form action='#' onSubmit={handleSubmit}>
        <input type="text"></input>
        <input type="submit" value='track'/>
    </form>
}

export default JarForm