import { FaSun, FaMoon } from 'react-icons/fa'; // You'll need to install react-icons

const LeftRibbon=(theme:any,setTheme:any)=>{
    const toggleTheme = () => {
        setTheme((prev: 'light' | 'vs-dark') => (prev === 'light' ? 'vs-dark' : 'light'));
      };
    return(<div style={{
        width: '60px',
        background: theme === 'light' ? '#f0f0f0' : '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '1rem',
      }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme === 'light' ? '#000' : '#fff',
            fontSize: '1.5rem'
          }}
          title="Toggle Theme"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <button>
            Save
        </button>
      </div>);
}
export default LeftRibbon;