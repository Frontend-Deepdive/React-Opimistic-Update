import './App.css';
import Card from './components/Card';

function App() {
  return (
    <>
      <h1>낙관적 업데이트를 구현해봅시다</h1>
      <h2>좋아요 버튼을 눌러보세요!</h2>
      <p>낙관적으로 성공해요</p>
      <Card initialLikes={0} isError={false} id='cider' />
      <p>낙관적으로 3초 뒤 실패해요</p>
      <Card initialLikes={0} isError={true} id='juni' />
    </>
  );
}

export default App;
