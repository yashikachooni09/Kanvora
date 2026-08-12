import { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const LabelManager = ({ cardId, labels = [], onLabelsUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);

  const colorOptions = [
    "#6366f1", // indigo
    "#0891b2", // cyan
    "#dc2626", // red
    "#ea580c", // orange
    "#22c55e", // green
    "#a855f7", // purple
    "#f59e0b", // amber
    "#ec4899", // pink
  ];

  const handleAddLabel = async (e) => {
    e.preventDefault();

    if (!labelName.trim()) {
      toast.error("Label name required");
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.post(`/cards/${cardId}/label`, {
        name: labelName,
        color: selectedColor,
      });

      if (res.success) {
        toast.success(`Label "${labelName}" added`);
        if (onLabelsUpdate) {
          onLabelsUpdate(res.data.labels);
        }
        setLabelName("");
        setSelectedColor("#6366f1");
        setShowForm(false);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add label";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLabel = async (labelName) => {
    setLoading(true);
    try {
      const res = await ApiClient.delete(`/cards/${cardId}/label`, {
        data: { labelName },
      });

      if (res.success) {
        toast.success(`Label removed`);
        if (onLabelsUpdate) {
          onLabelsUpdate(res.data.labels);
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to remove label";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Display Labels */}
      {labels && labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {labels.map((label, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white transition hover:shadow-lg"
              style={{ backgroundColor: label.color }}
            >
              <span>{label.name}</span>
              <button
                onClick={() => handleRemoveLabel(label.name)}
                disabled={loading}
                className="ml-1 hover:opacity-75 transition disabled:opacity-50"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Label Form Toggle */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 transition border border-slate-700 hover:border-cyan-600/50"
        >
          <FiPlus className="text-sm" />
          Add Label
        </button>
      )}

      {/* Add Label Form */}
      {showForm && (
        <div className="space-y-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="space-y-2">
            <input
              type="text"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder="Label name"
              disabled={loading}
              className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />

            {/* Color Picker */}
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={loading}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    selectedColor === color ? "border-white" : "border-transparent hover:border-slate-400"
                  } disabled:opacity-50`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowForm(false);
                setLabelName("");
              }}
              disabled={loading}
              className="px-2 py-1 rounded text-xs font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLabel}
              disabled={loading}
              className="px-2 py-1 rounded text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelManager;
