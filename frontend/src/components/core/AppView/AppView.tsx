/**
 * @license
 * Copyright 2018-2022 Streamlit Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement } from "react"
import VerticalBlock from "src/components/core/Block"
import { ThemedSidebar } from "src/components/core/Sidebar"
import { ScriptRunState } from "src/lib/ScriptRunState"
import { FormsData, WidgetStateManager } from "src/lib/WidgetStateManager"
import { FileUploadClient } from "src/lib/FileUploadClient"
import { ComponentRegistry } from "src/components/widgets/CustomComponent"
import { sendS4AMessage } from "src/hocs/withS4ACommunication/withS4ACommunication"

import PageLayoutContext from "src/components/core/PageLayoutContext"
import { BlockNode, AppRoot } from "src/lib/AppNode"

import {
  StyledAppViewBlockContainer,
  StyledAppViewContainer,
  StyledAppViewFooter,
  StyledAppViewFooterLink,
  StyledAppViewMain,
} from "./styled-components"

export interface AppViewProps {
  elements: AppRoot

  // The unique ID for the most recent script run.
  scriptRunId: string

  scriptRunState: ScriptRunState

  widgetMgr: WidgetStateManager

  uploadClient: FileUploadClient

  // Disable the widgets when not connected to the server.
  widgetsDisabled: boolean

  componentRegistry: ComponentRegistry

  formsData: FormsData
}

/**
 * Renders a Streamlit app.
 */
function AppView(props: AppViewProps): ReactElement {
  const {
    elements,
    scriptRunId,
    scriptRunState,
    widgetMgr,
    widgetsDisabled,
    uploadClient,
    componentRegistry,
    formsData,
  } = props

  React.useEffect(() => {
    const listener = (): void => {
      sendS4AMessage({
        type: "UPDATE_HASH",
        hash: window.location.hash,
      })
    }
    window.addEventListener("hashchange", listener, false)
    return () => window.removeEventListener("hashchange", listener, false)
  }, [])

  const { wideMode, initialSidebarState, embedded } = React.useContext(
    PageLayoutContext
  )
  const renderBlock = (node: BlockNode): ReactElement => (
    <StyledAppViewBlockContainer
      className="block-container"
      isWideMode={wideMode}
    >
      <VerticalBlock
        node={node}
        scriptRunId={scriptRunId}
        scriptRunState={scriptRunState}
        widgetMgr={widgetMgr}
        widgetsDisabled={widgetsDisabled}
        uploadClient={uploadClient}
        componentRegistry={componentRegistry}
        formsData={formsData}
      />
    </StyledAppViewBlockContainer>
  )

  const layout = wideMode ? "wide" : "narrow"
  // The tabindex is required to support scrolling by arrow keys.
  return (
    <StyledAppViewContainer
      className="appview-container"
      data-testid="stAppViewContainer"
      data-layout={layout}
    >
      {!elements.sidebar.isEmpty && (
        <ThemedSidebar initialSidebarState={initialSidebarState}>
          {renderBlock(elements.sidebar)}
        </ThemedSidebar>
      )}
      <StyledAppViewMain tabIndex={0} isEmbedded={embedded} className="main">
        {renderBlock(elements.main)}
        <StyledAppViewFooter isEmbedded={embedded} isWideMode={wideMode}>
          Made with{" "}
          <StyledAppViewFooterLink href="//streamlit.io">
            Streamlit
          </StyledAppViewFooterLink>
        </StyledAppViewFooter>
      </StyledAppViewMain>
    </StyledAppViewContainer>
  )
}

export default AppView
