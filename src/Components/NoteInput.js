import { useEffect } from "react";
import Button from "./Button";
import Dot from "./Dot";
import PlaceholderContainer from "./PlaceholderContainer";
import { toast } from "sonner";

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

  function handleDeleteNoteSubmit() {
    const toDlete = window.confirm("Are You sure to delete this note?");
    if (toDlete) handleDeleteNote(selectedNote);
  }

  // DELETE key handle to delete note
  useEffect(
    function () {
      function keyDelete(e) {
        if (selectedNote !== null && e.code === "Delete")
          handleDeleteNoteSubmit();
      }

      document.addEventListener("keyup", keyDelete);

      return () => document.removeEventListener("keyup", keyDelete);
    },
    [selectedNote, handleDeleteNoteSubmit]
  );

  // CTRL + S key handle download note
  const pressedKeys = {};
  useEffect(
    function () {
      function keyPressed(e) {
        if (selectedNote === null) return;

        function keyDownload(e) {
          pressedKeys[e.code] = true;

          if (
            pressedKeys["ControlLeft"] === true &&
            pressedKeys["KeyS"] === true
          )
            checkDelay(() => makeNoteFile(selectedNote), 5000);
        }
        keyDownload(e);
      }

      function keyReleased(e) {
        pressedKeys[e.code] = false;
      }

      document.addEventListener("keydown", keyPressed);
      document.addEventListener("keyup", keyReleased);

      return () => {
        document.removeEventListener("keydown", keyPressed);
        document.removeEventListener("keyup", keyReleased);
      };
    },
    [selectedNote]
  );

  function makeNoteFile(noteToDownload) {
    //text inside file
    const textInside = noteToDownload.description;

    const blob = new Blob([textInside], { type: "text/directory" });

    //creating link to download a file
    const a = document.createElement("a");
    a.download = `${noteToDownload.title}.txt`;
    a.href = window.URL.createObjectURL(blob);
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);

    toast.success("note succesfully downloaded!");
  }

  let lastExecutionTime;
  function checkDelay(callback, delay) {
    const currTime = new Date().getTime();

    if (lastExecutionTime && currTime - lastExecutionTime < delay) {
      toast.warning("You can download one note per 5sec!", {
        style: { width: "32rem" },
      });

      lastExecutionTime = currTime;
      return;
    }

    callback();
    lastExecutionTime = currTime;
  }

  //nie pokazuje sie toast EDITED, bo tam w Componencie App sprawdzam czy aktualny title jest taki sam jak ten
  //z przekazanej notatki, a gdy na nowo wchodze do innej notatki to tak wlasnie jest
  useEffect(
    function () {
      if (selectedNote === null) return;

      const timeout = setTimeout(() => {
        handleUpdateNote(selectedNote);
      }, 5000);

      return () => clearTimeout(timeout);
    },
    [titleFromInput, descriptionFromInput, handleUpdateNote, selectedNote]
  );

  return (
    <div>
      <form className="noteInput" onSubmit={(e) => e.preventDefault()}>
        <input
          value={titleFromInput}
          onChange={(e) => {
            setTitleFromInput(e.target.value);
          }}
          placeholder={
            showAddNote
              ? "Type title of your note"
              : "Choose a note or start typing to add new note"
          }
          className="noteInput__title"
        ></input>
        <textarea
          value={descriptionFromInput}
          onChange={(e) => setDescriptionFromInput(e.target.value)}
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
              direction="left"
              onClick={() => checkDelay(() => makeNoteFile(selectedNote), 5000)}
            >
              DOWNLOAD
            </Button>
            <Button
              position="absolute"
              direction="right"
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
