import Button from "./Button";
import Dot from "./Dot";
import PlaceholderContainer from "./PlaceholderContainer";

export default function NoteInput({
  selectedNote,
  showAddNote,
  titleFromInput,
  descriptionFromInput,
  setTitleFromInput,
  setDescriptionFromInput,
  handleAddNoteToList,
  handleUpdateNote,
  handleDeleteNote,
  setShowAddNote,
  color,
  setColor,
}) {
  function handleNewNoteSubmit(e) {
    e.preventDefault();

    if (!titleFromInput) return;

    const newNote = {
      id: crypto.randomUUID(),
      title: titleFromInput,
      description: descriptionFromInput,
      color: color,
    };

    handleAddNoteToList(newNote);
  }

  function handleEditNoteSubmit(e) {
    e.preventDefault();

    handleUpdateNote(selectedNote);
  }

  function handleDeleteNoteSubmit(e) {
    e.preventDefault();

    const toDlete = window.confirm("Are You sure to delete this note?");
    if (toDlete) handleDeleteNote(selectedNote);
  }

  function handleEmptyNote(e) {
    //this function will execute only once if needed (so when selectedNote && showAddNote are both FALSE)
    // (so at first render of app, and while deleting one of the notes)
    // when u start typing state showAddNote = true and this function wont be executed again
    // cause we are in normal showAddNote=true state so as u would click the button

    setShowAddNote(true);
    e.target.nodeName === "INPUT"
      ? setTitleFromInput(e.target.value)
      : setDescriptionFromInput(e.target.value);
  }

  return (
    <div>
      <form className="noteInput" onSubmit={(e) => e.preventDefault()}>
        <input
          value={titleFromInput}
          onChange={(e) =>
            !selectedNote && !showAddNote // Z PRAW DE MORGANA !a * !b = !(a+b) ==> !(selectedNote || showAddNote) ale tamto jest bardziej zrozumiale :)
              ? handleEmptyNote(e)
              : setTitleFromInput(e.target.value)
          }
          placeholder={
            showAddNote
              ? "Type title of your note"
              : "Choose a note or start typing to add new note"
          }
          className="noteInput__title"
        ></input>
        <textarea
          value={descriptionFromInput}
          onChange={(e) =>
            !selectedNote && !showAddNote
              ? handleEmptyNote(e)
              : setDescriptionFromInput(e.target.value)
          }
          contentEditable
          className="noteInput__body"
          placeholder={showAddNote ? "Type description of your note" : ""}
        ></textarea>
        {(showAddNote || selectedNote) && (
          <Dot
            cssClass={`dot ${color} absolute`}
            setColor={setColor}
            color={color}
          />
        )}
        {showAddNote && (
          <Button
            position={"absolute"}
            direction={"right"}
            onClick={handleNewNoteSubmit}
          >
            ADD
          </Button>
        )}
        {selectedNote && (
          <>
            <Button
              position="absolute"
              direction="right"
              onClick={handleEditNoteSubmit}
            >
              EDIT
            </Button>
            <Button
              position="absolute"
              direction="left"
              onClick={handleDeleteNoteSubmit}
            >
              DELETE
            </Button>
          </>
        )}
      </form>
      <PlaceholderContainer />
    </div>
  );
}
