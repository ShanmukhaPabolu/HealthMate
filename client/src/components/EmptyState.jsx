import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = 'fas fa-folder-open',
  title = 'No records found',
  description = 'There are no items matching your request at this moment.',
  actionText,
  actionLink,
  onActionClick
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      <i className={icon} />
    </div>
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-desc">{description}</p>
    {actionText && (
      actionLink ? (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      ) : (
        <button onClick={onActionClick} className="btn btn-primary">
          {actionText}
        </button>
      )
    )}
  </div>
);

export default EmptyState;
