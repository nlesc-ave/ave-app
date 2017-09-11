import * as React from 'react'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back'
import { Link } from 'react-router-dom'

const styles = {
  logo: {} as React.CSSProperties,
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 20
  } as React.CSSProperties
}

export const AboutPage = () => {
  const backButton = (
    <IconButton containerElement={<Link to="/" />} tooltip="Back to start">
      <NavigationBack />
    </IconButton>
  )
  return (
    <div>
      <AppBar
        title="Allelic Variation Explorer: About"
        iconElementLeft={backButton}
      />
      <div style={styles.root}>
        <Paper style={styles.logo}>
          <a href="http://vlpb.nl/">Virtual Laboratory Plant Breeding</a>
        </Paper>
        <Paper style={styles.logo}>
          <a href="https://www.esciencecenter.nl">
            <img
              src="https://www.esciencecenter.nl/img/cdn/logo_escience_center.png"
              alt="Netherlands eScience Center"
            />
          </a>
        </Paper>
        <Paper style={styles.logo}>
          <a href="http://uva.nl/">University of Amsterdam</a>
        </Paper>
        <Paper style={styles.logo}>SESVanderHave</Paper>
        <Paper style={styles.logo}>Bayer CropScience</Paper>
        <Paper style={styles.logo}>Bejo zaden</Paper>
        <Paper style={styles.logo}>Rijk Zwaan</Paper>
      </div>
    </div>
  )
}
