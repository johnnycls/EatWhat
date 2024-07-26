import React, { useState } from "react";
import { ColumnEditorOptions } from "primereact/column";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";

const CatEditor: React.FC<{ options: ColumnEditorOptions; cats: string[] }> = ({
  options,
  cats,
}) => {
  const [catOptions, setCatOptions] = useState<string[]>([]);

  return (
    <AutoComplete
      multiple
      value={options.value}
      suggestions={catOptions}
      completeMethod={(event: AutoCompleteCompleteEvent) => {
        setCatOptions(
          [
            ...cats.filter((cat: string) => cat.includes(event.query)),
            event.query,
          ].filter((cat) => cat)
        );
      }}
      onChange={(e) => {
        if (options.editorCallback) {
          options.editorCallback(e.value);
        }
      }}
      dropdown
    />
  );
};

export default CatEditor;
