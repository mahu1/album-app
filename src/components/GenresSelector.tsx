import { useState } from "react"
import Select from "react-select"

export const GenresSelector = () => {
  const [selectedOptions, setSelectedOptions] = useState(null);

  interface Option {
    value: string,
    label: string
  }

  const optionList = [
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
    { value: "white", label: "White" }
  ]

  const handleSelect = (selectedOption: any): void => {
    setSelectedOptions(selectedOption)
  }

  return (
    <div className="selectList">
        <Select
            options={optionList}
            placeholder="Select color"
            value={selectedOptions}
            onChange={handleSelect}
            isSearchable={true}
            isMulti
        />
    </div>
  )
}