// Shared EmailTable for add-quest and quest-detail
import React from "react";

interface Props {
  emails: string[];
  onRemove: (email: string) => void;
}

const EmailTable: React.FC<Props> = ({ emails, onRemove }) => (
  <table>
    <tbody>
      {emails.map((email) => (
        <tr key={email}>
          <td>{email}</td>
          <td>
            <button onClick={() => onRemove(email)}>Remove</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default EmailTable;
