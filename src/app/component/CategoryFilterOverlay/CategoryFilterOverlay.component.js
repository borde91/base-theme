/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import Overlay from 'Component/Overlay';
import ResetButton from 'Component/ResetButton';
import CategoryConfigurableAttributes from 'Component/CategoryConfigurableAttributes';
import Loader from 'Component/Loader';

import './CategoryFilterOverlay.style';

export const CATEGORY_FILTER_OVERLAY_ID = 'category-filter';

/** @namespace Component/CategoryFilterOverlay/Component */
export class CategoryFilterOverlay extends PureComponent {
    static propTypes = {
        availableFilters: PropTypes.objectOf(PropTypes.shape).isRequired,
        areFiltersEmpty: PropTypes.bool.isRequired,
        isContentFiltered: PropTypes.bool.isRequired,
        isInfoLoading: PropTypes.bool.isRequired,
        isProductsLoading: PropTypes.bool.isRequired,
        onSeeResultsClick: PropTypes.func.isRequired,
        onVisible: PropTypes.func.isRequired,
        customFiltersValues: PropTypes.objectOf(PropTypes.array).isRequired,
        toggleCustomFilter: PropTypes.func.isRequired,
        getFilterUrl: PropTypes.func.isRequired,
        totalPages: PropTypes.number.isRequired
    };

    renderFilters() {
        const {
            availableFilters,
            customFiltersValues,
            toggleCustomFilter,
            getFilterUrl
        } = this.props;

        const isLoaded = availableFilters && !!Object.keys(availableFilters).length;

        return (
            <CategoryConfigurableAttributes
              mix={ { block: 'CategoryFilterOverlay', elem: 'Attributes' } }
              isReady={ isLoaded }
              configurable_options={ availableFilters }
              getLink={ getFilterUrl }
              parameters={ customFiltersValues }
              updateConfigurableVariant={ toggleCustomFilter }
            />
        );
    }

    renderSeeResults() {
        const { onSeeResultsClick } = this.props;

        return (
            <div
              block="CategoryFilterOverlay"
              elem="SeeResults"
            >
                <button
                  block="CategoryFilterOverlay"
                  elem="Button"
                  mix={ { block: 'Button' } }
                  onClick={ onSeeResultsClick }
                >
                    { __('SEE RESULTS') }
                </button>
            </div>
        );
    }

    renderResetButton() {
        const { onSeeResultsClick } = this.props;

        return (
            <ResetButton
              onClick={ onSeeResultsClick }
              mix={ { block: 'CategoryFilterOverlay', elem: 'ResetButton' } }
            />
        );
    }

    renderHeading() {
        return (
            <h2 block="CategoryFilterOverlay" elem="Heading">
                { __('Shopping Options') }
            </h2>
        );
    }

    renderNoResults() {
        return (
            <p block="CategoryFilterOverlay" elem="NoResults">
                { __(`The selected filter combination returned no results.
                Please try again, using a different set of filters.`) }
            </p>
        );
    }

    renderEmptyFilters() {
        return (
            <>
                { this.renderNoResults() }
                { this.renderResetButton() }
                { this.renderSeeResults() }
            </>
        );
    }

    renderMinimalFilters() {
        return this.renderSeeResults();
    }

    renderDefaultFilters() {
        return (
            <>
                { this.renderHeading() }
                { this.renderResetButton() }
                { this.renderFilters() }
                { this.renderSeeResults() }
            </>
        );
    }

    renderContent() {
        const {
            totalPages,
            areFiltersEmpty,
            isProductsLoading
        } = this.props;

        if (!isProductsLoading && totalPages === 0) {
            return this.renderEmptyFilters();
        }

        if (areFiltersEmpty) {
            return this.renderMinimalFilters();
        }

        return this.renderDefaultFilters();
    }

    renderLoader() {
        const {
            isInfoLoading,
            availableFilters
        } = this.props;

        const isLoaded = availableFilters && !!Object.keys(availableFilters).length;

        if (!isLoaded) { // hide loader if filters were not yet loaded (even once!)
            return null;
        }

        return (
            <Loader isLoading={ isInfoLoading } />
        );
    }

    render() {
        const {
            onVisible,
            totalPages,
            isProductsLoading,
            isContentFiltered
        } = this.props;

        if (!isProductsLoading && totalPages === 0 && !isContentFiltered) {
            return (
                <div block="CategoryFilterOverlay" />
            );
        }

        return (
            <Overlay
              onVisible={ onVisible }
              mix={ { block: 'CategoryFilterOverlay' } }
              id={ CATEGORY_FILTER_OVERLAY_ID }
              isRenderInPortal={ false }
            >
                <div>
                    { this.renderContent() }
                    { this.renderLoader() }
                </div>
            </Overlay>
        );
    }
}

export default CategoryFilterOverlay;
